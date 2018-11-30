const express = require('express')
const config = require('./config')
const formatters = require('./formatters')
const slackApi = require('./slack')
const models = require('./models')
const utils = require('./utils')
const controller = require('./controller')

const port = config.PORT
const validationToken = config.SLACK_VERIFICATION_TOKEN

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/poll', async (req, res) => {
  if (!req.body || req.body.token !== validationToken) {
    return res.status(403).json({ errors: ['Request is not signed correctly!'] })
  }

  const text = utils.cleanDoubleQuotes(req.body.text)
  const items = formatters.splitItems(text)

  if (items.options.length > 10) {
    await slackApi('chat.postMessage', 'POST', {
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

    return res.status(202).send()
  }

  const pollTitle = `${items.question}\n\n`
  const pollOptions = formatters.pollOptionsString(items)

  const currentPoll = await models.Poll.create({
    text: req.body.text,
    owner: req.body.user_id,
    channel: req.body.channel_id,
    mode: items.mode
  }).then(m => m.get({ plain: true }))

  try {
    const titleResponse = await slackApi('chat.postMessage', 'POST', {
      attachments: [
        {
          pretext: req.body.text,
          fallback: pollTitle,
          title: pollTitle,
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default',
          footer: formatters.stringFromPollMode(currentPoll.mode)
        }, {
          fallback: pollOptions,
          text: pollOptions,
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default'
        },
        ...formatters.mapAttatchmenBody(items, currentPoll, {
          fallback: '',
          title: '',
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default'
        }),
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
      titleTs: titleResponse.ts
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
  if (!req.body) return res.status(400).send('Empty body')
  const body = JSON.parse(req.body.payload)

  if (body.token !== validationToken) {
    return res.status(403).send('Request is not signed correctly!')
  }

  if (body.type === 'interactive_message') {
    const currentPoll = await models.Poll.findById(body.callback_id, { raw: true })
    if (!currentPoll) throw new Error('Unexisting poll!')

    if (body.actions[0].value === 'cancel-null') {
      if (currentPoll.owner !== body.user.id) return res.status(204).send()
      await controller.deletePoll(currentPoll)
      return res.status(201).send()
    }

    const userAnswer = await controller.addAnswerToPoll(currentPoll, {
      pollId: currentPoll.id,
      answer: body.actions[0].value,
      userId: body.user.id,
      username: body.user.name
    })

    const currentPollAnswers = await controller.readPollAnswers(currentPoll)
    const text = utils.cleanDoubleQuotes(currentPoll.text)
    const items = formatters.splitItems(text)

    const pollTitle = `${items.question}\n\n`
    const pollOptions = formatters.pollEnhancedOptionsString(items, currentPollAnswers)

    try {
      await slackApi('chat.update', 'POST', {
        link_names: 1,
        parse: 'full',
        channel: body.channel.id,
        ts: currentPoll.titleTs,
        attachments: [
          {
            pretext: currentPoll.text,
            fallback: pollTitle,
            title: pollTitle,
            callback_id: currentPoll.id,
            color: '#ffd100',
            attachment_type: 'default',
            footer: formatters.stringFromPollMode(currentPoll.mode)
          }, {
            fallback: pollOptions,
            text: pollOptions,
            callback_id: body.callback_id,
            color: '#ffd100',
            attachment_type: 'default',
            mrkdwn_in: ['text']
          },
          ...formatters.mapAttatchmenBody(items, currentPoll, {
            fallback: '',
            title: '',
            callback_id: currentPoll.id,
            color: '#ffd100',
            attachment_type: 'default'
          }),
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
        ]
      })
    } catch (err) {
      await models.PollAnswer.destroy({ where: { id: userAnswer.id } })
      throw err
    }
  }

  return res.status(201).send()
})

module.exports = app
app.listen(port, () => {
  console.log(`=>> App listen on ${port}`)
})
