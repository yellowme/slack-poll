const express = require('express')
const config = require('./config')
const formatters = require('./formatters')
const slack = require('./slack')
const models = require('./models')
const utils = require('./utils')

const port = config.PORT
const validationToken = config.SLACK_VERIFICATION_TOKEN

const emojis = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten']

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/poll', async (req, res) => {
  if (!req.body || req.body.token !== validationToken) {
    return res.status(403).send('Request is not signed correctly!')
  }

  const text = utils.cleanDoubleQuotes(req.body.text)
  const items = formatters.splitItems(text)

  if (items.options.length > 10) {
    await slack.sendPollMessage({
      attachments: [
        {
          fallback: 'Sorry, creating polls with more than 10 options is not supported yet',
          title: 'Sorry :sweat:',
          text: 'Creating polls with more than 10 options is not supported yet',
          color: '#FF0D00',
          attachment_type: 'default'
        }
      ],
      channel: req.body.channel_id,
      username: 'Yellow Poll'
    })

    return res.status(200).send()
  }

  const pollTitle = `${items.question}\n\n`
  const pollOptions = items.options.reduce((text, option, index) => (
    `${text}:${emojis[index]}: ${option} \n\n`
  ), '')

  const currentPoll = await models.Poll.create({
    text: req.body.text
  }, {
    raw: true
  })

  try {
    const titleResponse = await slack.sendPollMessage({
      attachments: [
        {
          fallback: pollTitle,
          title: pollTitle,
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default'
        }
      ],
      channel: req.body.channel_id,
      username: 'Yellow Poll'
    })

    const optionsResponse = await slack.sendPollMessage({
      attachments: [
        {
          fallback: pollOptions,
          text: pollOptions,
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default'
        }
      ],
      channel: req.body.channel_id,
      username: 'Yellow Poll'
    })

    const buttonsResponse = await slack.sendPollMessage({
      attachments: [
        {
          fallback: '',
          title: '',
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default',
          actions: [
            ...items.options.slice(0, 5).map((option, index) => ({
              name: `${option}-${index}`,
              text: `:${emojis[index]}:`,
              type: 'button',
              value: `${option}-${index}`
            }))
          ]
        }
      ],
      channel: req.body.channel_id,
      username: 'Yellow Poll'
    })

    const buttons2Response = items.options.length > 5
      ? await slack.sendPollMessage({
        attachments: [
          {
            fallback: '',
            title: '',
            callback_id: currentPoll.id,
            color: '#ffd100',
            attachment_type: 'default',
            actions: [
              ...items.options.slice(5, 10).map((option, _index) => {
                const index = _index + 5
                return {
                  name: `${option}-${index}`,
                  text: `:${emojis[index]}:`,
                  type: 'button',
                  value: `${option}-${index}`
                }
              })
            ]
          }
        ],
        channel: req.body.channel_id,
        username: 'Yellow Poll'
      })
      : {}

    const buttonDeleteResponse = await slack.sendPollMessage({
      attachments: [
        {
          fallback: '',
          title: '',
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default',
          actions: [
            {
              name: 'cancel',
              text: 'Delete Poll',
              style: 'danger',
              type: 'button',
              value: 'cancel-null',
              confirm: {
                title: 'Delete Poll?',
                text: 'Are you sure you want to delete the Poll?',
                ok_text: 'Yes',
                dismiss_text: 'No'
              }
            }
          ]
        }
      ],
      channel: req.body.channel_id,
      username: 'Yellow Poll'
    })

    await models.Poll.update({
      text: req.body.text,
      titleTs: titleResponse.ts,
      optionsTs: optionsResponse.ts,
      buttonsTs: buttonsResponse.ts,
      buttons2Ts: buttons2Response.ts,
      buttonDeleteTs: buttonDeleteResponse.ts
    }, {
      where: {
        id: currentPoll.id
      }
    })
  } catch (err) {
    await models.Poll.destroy({ where: { id: currentPoll.id } })
    throw err
  }

  return res.status(201).send()
})

app.post('/hook', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Empty body')
  }

  const body = JSON.parse(req.body.payload)

  if (body.token !== validationToken) {
    return res.status(403).send('Request is not signed correctly!')
  }

  if (body.type === 'interactive_message') {
    const currentPoll = await models.Poll.findById(body.callback_id, { raw: true })
    if (!currentPoll) throw new Error('Unexisting poll!')

    const currentUserAnswer = await models.PollAnswer.findOne({
      where: {
        pollId: currentPoll.id,
        userId: body.user.id
      },
      raw: true
    })

    await models.PollAnswer.destroy({
      where: {
        pollId: currentPoll.id,
        userId: body.user.id
      }
    })

    if (body.actions[0].value === 'cancel-null') {
      await slack.deletePollMessage({
        channel: body.channel.id,
        ts: currentPoll.buttonDeleteTs
      })
      await slack.deletePollMessage({
        channel: body.channel.id,
        ts: currentPoll.buttons2Ts
      })
      await slack.deletePollMessage({
        channel: body.channel.id,
        ts: currentPoll.buttonsTs
      })
      await slack.deletePollMessage({
        channel: body.channel.id,
        ts: currentPoll.optionsTs
      })
      await slack.deletePollMessage({
        channel: body.channel.id,
        ts: currentPoll.titleTs
      })
      await models.Poll.destroy({
        where: {
          id: currentPoll.id
        }
      })

      return res.status(201).send()
    }

    const userAnswer = (currentUserAnswer && currentUserAnswer.answer === body.actions[0].value)
      ? {}
      : await models.PollAnswer.create({
        pollId: currentPoll.id,
        answer: body.actions[0].value,
        userId: body.user.id,
        username: body.user.name
      }, {
        raw: true
      })

    const currentPollAnswers = await models.PollAnswer.findAll({
      where: {
        pollId: currentPoll.id
      },
      raw: true
    })

    const text = utils.cleanDoubleQuotes(currentPoll.text)
    const items = formatters.splitItems(text)

    const pollOptions = items.options.reduce((text, option, index) => {
      const answerValue = `${option}-${index}`
      const allUserAnswers = currentPollAnswers.filter(cpa => cpa.answer === answerValue)
      const usernamesString = allUserAnswers.reduce((text, user) => `${text} @${user.username}`, '')
      const counterString = allUserAnswers.length !== 0
        ? '`' + allUserAnswers.length + '`'
        : ''

      return `${text}:${emojis[index]}: ${option}: ${counterString} ${usernamesString} \n\n `
    }, '')

    try {
      await slack.updatePollMessage({
        link_names: 1,
        parse: 'full',
        channel: body.channel.id,
        ts: currentPoll.optionsTs,
        attachments: [
          {
            fallback: pollOptions,
            text: pollOptions,
            callback_id: body.callback_id,
            color: '#ffd100',
            attachment_type: 'default',
            mrkdwn_in: ['text']
          }
        ]
      })
    } catch (err) {
      await models.PollAnswer.destroy({ where: { id: userAnswer.id } })
      throw err
    }
  }

  return res.status(201).send()
})

app.listen(port, () => {
  console.log(`App listen on ${port}`)
})