const config = require('./config');
const formatters = require('./formatters');
const slackApi = require('./slack');
const models = require('./models');
const utils = require('./utils');
const service = require('./service');
const constants = require('./constants');

// Base message template from https://api.slack.com/docs/message-formatting
function messageTemplate(messageData) {
  const { pollTitle, pollOptions, items, currentPoll, emojis } = messageData;

  return {
    attachments: [
      {
        fallback: pollTitle,
        title: pollTitle,
        callback_id: currentPoll.id,
        color: '#ffd100',
        attachment_type: 'default',
        footer: formatters.stringFromPollMode(currentPoll.mode)
      },
      {
        fallback: pollOptions,
        text: pollOptions,
        callback_id: currentPoll.id,
        color: '#ffd100',
        attachment_type: 'default'
      },
      ...utils.chunkArray(items.options, 5).map((chunk, chunkIndex) => ({
        fallback: '',
        title: '',
        callback_id: currentPoll.id,
        color: '#ffd100',
        attachment_type: 'default',
        actions: chunk.map((option, index) => {
          const currentIndex = chunkIndex * 5 + index;
          return {
            name: `${option}-${currentIndex}`,
            text: `:${emojis[currentIndex]}:`,
            type: 'button',
            value: `${option}-${currentIndex}`
          };
        })
      })),
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
  };
}

// Generic options strcuture
function generateBaseOptions(bodyText) {
  const items = formatters.splitItems(utils.cleanDoubleQuotes(bodyText));
  const emojis =
    items.options.length > 10 ? constants.fullEmoji : constants.limitedEmoji;
  const pollTitle = `${items.question}\n\n`;
  const pollOptions = formatters.pollOptionsString(items, emojis);
  return { items, emojis, pollTitle, pollOptions };
}

// POST /poll
async function pollPost(req, res) {
  if (!req.body || req.body.token !== config.SLACK_VERIFICATION_TOKEN) {
    return res
      .status(403)
      .json({ errors: ['Request is not signed correctly!'] });
  }

  const { items, emojis, pollOptions, pollTitle } = generateBaseOptions(
    req.body.text
  );

  const currentPoll = await models.Poll.create({
    text: req.body.text,
    owner: req.body.user_id,
    channel: req.body.channel_id,
    mode: items.mode
  }).then(m => m.get({ plain: true }));

  try {
    /*
    await slackApi('chat.postMessage', 'POST', {
      as_user: true,
      channel: req.body.channel_id,
      text: req.body.text
    });
    */

    const titleResponse = await slackApi('chat.postMessage', 'POST', {
      ...messageTemplate({
        pollTitle,
        pollOptions,
        items,
        currentPoll,
        emojis
      }),
      channel: req.body.channel_id,
      username: 'Yellow Poll'
    });

    await models.Poll.update(
      { titleTs: titleResponse.ts },
      { where: { id: currentPoll.id } }
    );

    return res.status(201).send();
  } catch (err) {
    await models.Poll.destroy({ where: { id: currentPoll.id } });
    throw err;
  }
}

// POST /hook
async function hookPost(req, res) {
  if (!req.body) return res.status(400).send('Empty body');
  const body = JSON.parse(req.body.payload);

  if (body.token !== config.SLACK_VERIFICATION_TOKEN) {
    return res.status(403).send('Request is not signed correctly!');
  }

  if (body.type === 'interactive_message') {
    const currentPoll = await models.Poll.findById(body.callback_id, {
      raw: true
    });
    if (!currentPoll) throw new Error('Unexisting poll!');

    if (body.actions[0].value === 'cancel-null') {
      if (currentPoll.owner !== body.user.id) return res.status(204).send();
      await service.deletePoll(currentPoll);
      return res.status(201).send();
    }

    const userAnswer = await service.addAnswerToPoll(currentPoll, {
      pollId: currentPoll.id,
      answer: body.actions[0].value,
      userId: body.user.id,
      username: body.user.name
    });

    const { items, emojis, pollTitle } = generateBaseOptions(currentPoll.text);
    const currentPollAnswers = await service.readPollAnswers(currentPoll);
    const pollOptions = formatters.pollEnhancedOptionsString(
      items,
      currentPollAnswers,
      emojis
    );

    try {
      await slackApi('chat.update', 'POST', {
        ...messageTemplate({
          pollTitle,
          pollOptions,
          items,
          currentPoll,
          emojis,
          text: currentPoll.text
        }),
        link_names: 1,
        parse: 'full',
        channel: body.channel.id,
        ts: currentPoll.titleTs
      });
    } catch (err) {
      await models.PollAnswer.destroy({ where: { id: userAnswer.id } });
      throw err;
    }
  }

  return res.status(201).send();
}

module.exports = {
  pollPost,
  hookPost
};
