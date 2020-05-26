// Mock enviroment
jest.mock('sequelize', () => {
  const sequelize = jest.requireActual('sequelize');

  function SequelizeMock() {
    // eslint-disable-next-line no-new
    return new sequelize.Sequelize('sqlite::memory:', {
      logging: false,
    });
  }

  return {
    Sequelize: SequelizeMock,
  };
});

jest.mock('./config.js', () => ({
  SLACK_MESSAGE_ICON_EMOJIS: 'bar_chart',
  SLACK_VERIFICATION_TOKEN: 'slack_verification_token',
  SLACK_ACCESS_TOKEN: 'slack_access_token',
}));

jest.mock('./lib/slack.js', () => {
  return {
    chat: {
      postMessage: jest.fn(() => ({
        ts: Date.now(),
      })),
    },
  };
});
