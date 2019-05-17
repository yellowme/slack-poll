jest.mock('dotenv', () => {
  process.env.SLACK_VERIFICATION_TOKEN = 'test';
  process.env.SLACK_ACCESS_TOKEN = 'test';

  return {
    config: jest.fn(),
  };
});
