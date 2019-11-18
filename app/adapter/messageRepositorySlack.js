const utils = require('../utils');

function createMessageRepository(slack) {
  function insert(data) {
    return slack.chatPostMessage(chatPostMessageTemplate(data));
  }

  return {
    insert,
  };
}

function chatPostMessageTemplate({ channel, title, owner, mode, options }) {
  return {
    channel,
    // username,
    // icon_emoji,
    attachments: [
      {
        fallback: title,
        title: title,
        // callback_id: timestamp,
        // color: config.SLACK_MESSAGE_BAR_COLOR,
        attachment_type: 'default',
        footer: `By: <@${owner}>, Mode: ${mode}`,
      },
      {
        fallback: options.join(', '),
        text: options.join(', '),
        // callback_id: timestamp,
        // color: config.SLACK_MESSAGE_BAR_COLOR,
        attachment_type: 'default',
      },
      ...utils.chunkArray(options, 5).map((chunk, chunkIndex) => ({
        fallback: '',
        title: '',
        // callback_id: pollAssets.id,
        // color: config.SLACK_MESSAGE_BAR_COLOR,
        attachment_type: 'default',
        actions: chunk.map((option, index) => {
          const currentIndex = chunkIndex * 5 + index;
          return {
            name: `${option}-${currentIndex}`,
            text: `:emojis[currentIndex]:`,
            type: 'button',
            value: `${option}-${currentIndex}`,
          };
        }),
      })),
      {
        fallback: '',
        title: '',
        //callback_id: pollAssets.id,
        //color: config.SLACK_MESSAGE_BAR_COLOR,
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
              dismiss_text: 'No',
            },
          },
        ],
      },
    ],
  };
}

module.exports = createMessageRepository;
