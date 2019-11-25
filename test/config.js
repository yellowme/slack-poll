// Mock enviroment
jest.mock('../app/config.js', () => ({
  SLACK_VERIFICATION_TOKEN: 'slack_verification_token',
  SLACK_ACCESS_TOKEN: 'slack_access_token',
  SLACK_APP_DISPLAY_NAME: 'Yellow Poll',
  SLACK_MESSAGE_BAR_COLOR: '#ffd100',
  SLACK_MESSAGE_ICON_EMOJIS: 'bar_chart',
  PORT: 3000,
  SLACK_BASE_URL: 'https://slack.com/api',
}));
