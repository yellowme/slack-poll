function chunkArray(array, limit = 0, res = []) {
  if (array.length === 0) return res;
  return chunkArray(array.slice(limit, array.length), limit, [
    ...res,
    array.slice(0, limit),
  ]);
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
  color,
  attachment_type = 'default',
  footer,
  ...options
}) {
  return {
    fallback,
    title,
    // callback_id,
    // color,
    attachment_type,
    footer,
    ...options,
  };
}

function pollsMessageSerializerSlack(poll, channel) {
  return {
    channel,
    // username,
    // icon_emoji,
    attachments: [
      createAttachment({
        title: poll.question,
        fallback: poll.question,
        footer: `By: <@${poll.owner}>, Mode: ${poll.mode}`,
      }),
      createAttachment({
        text: poll.options.join(', '),
        fallback: poll.options.join(', '),
      }),
      ...chunkArray(poll.options, 5).map((chunk, chunkIndex) => ({
        actions: chunk.map((option, index) => {
          const currentIndex = chunkIndex * 5 + index;
          return createAttachmentAction({
            name: `${option}-${currentIndex}`,
            text: `:emojis[currentIndex]:`,
            type: 'button',
            value: `${option}-${currentIndex}`,
          });
        }),
      })),
      createAttachment({
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
