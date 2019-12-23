/* eslint-disable camelcase */

const config = require('../../../config');
const utils = require('../../../utils');
const emojis = require('../../../emojis');

// Format emojis with :: that slack needs to print an emojit
// It will pick a random emoji from list on pollPost
const iconEmojis = config.SLACK_MESSAGE_ICON_EMOJIS.split(',').map(
  emoji => `:${emoji}:`
);

function decoratePollOptions(responses) {
  const groupedResponses = utils.groupBy(responses, 'option');

  return (base, option, index) => {
    const optionWithEmoji = `${emojis[index]}: ${option}`;
    if (!responses) return `${base}:${optionWithEmoji} \n\n`;

    // Option ID is generate by option value and index
    const pollResponses = groupedResponses[`${option}-${index}`] || [];

    // Collect Times the answer was selected
    // And Users who select those answers
    const count = `\`${pollResponses.length}\``;
    const owners = pollResponses.reduce(
      (acc, resp) => `${acc} <@${resp.owner}>`,
      ''
    );

    return `${base}:${optionWithEmoji}: ${count} ${owners} \n\n `;
  };
}

function createAttachmentAction({
  name,
  text,
  type = 'button',
  value,
  ...options
}) {
  return {
    name,
    text,
    type,
    value,
    ...options,
  };
}

function createAttachment({
  fallback = '',
  title = '',
  callback_id,
  color = config.SLACK_MESSAGE_BAR_COLOR,
  attachment_type = 'default',
  footer,
  ...options
}) {
  return {
    fallback,
    title,
    callback_id,
    color,
    attachment_type,
    footer,
    ...options,
  };
}

// Serializes poll entity to slack message format
// https://api.slack.com/methods/chat.postMessage
function pollsMessageSerializerSlack(
  poll,
  {
    responses,
    channel,
    username = config.SLACK_APP_DISPLAY_NAME,
    // Pick a random in list
    icon_emoji = utils.arraySample(iconEmojis),
  }
) {
  const pollOptionsString = poll.options.reduce(
    decoratePollOptions(responses),
    ''
  );

  return {
    channel,
    username,
    icon_emoji,
    attachments: [
      createAttachment({
        title: poll.question,
        fallback: poll.question,
        callback_id: poll.id,
        footer: `By: <@${poll.owner}>, Mode: ${
          poll.mode === 's' ? 'Single' : 'Multiple'
        }`,
      }),
      createAttachment({
        text: pollOptionsString,
        fallback: pollOptionsString,
        callback_id: poll.id,
      }),
      ...utils.chunkArray(poll.options, 5).map((chunk, chunkIndex) =>
        createAttachment({
          callback_id: poll.id,
          actions: chunk.map((option, index) => {
            const currentIndex = chunkIndex * 5 + index;
            return createAttachmentAction({
              name: `${option}-${currentIndex}`,
              text: `:${emojis[currentIndex]}:`,
              value: `${option}-${currentIndex}`,
            });
          }),
        })
      ),
      createAttachment({
        callback_id: poll.id,
        actions: [
          createAttachmentAction({
            name: 'cancel',
            text: 'Delete Poll',
            style: 'danger',
            value: 'cancel-null',
            confirm: {
              title: 'Delete Poll?',
              text: 'Are you sure you want to delete the Poll?',
              ok_text: 'Yes',
              dismiss_text: 'No',
            },
          }),
        ],
      }),
    ],
  };
}

module.exports = pollsMessageSerializerSlack;
