function createTestSlackApi() {
  function chatPostMessage({
    token,
    channel,
    text,
    as_user,
    attachments,
    blocks,
    icon_emoji,
    icon_url,
    link_names,
    mrkdwn,
    parse,
    reply_broadcast,
    thread_ts,
    unfurl_links,
    unfurl_media,
    username,
  }) {
    return {
      ok: true,
      channel: 'C1H9RESGL',
      ts: Date.now(),
      message: {
        text: text,
        username: username,
        bot_id: 'B19LU7CSY',
        attachments: attachments,
        type: 'message',
        subtype: 'bot_message',
        ts: Date.now(),
      },
    };
  }

  return {
    chatPostMessage: jest.fn(chatPostMessage),
  };
}

module.exports = createTestSlackApi;
