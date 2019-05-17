const config = require('../config');

const { _verifyEnv: verifyEnv } = config;

describe('config.js', () => {
  it('load env config', () => {
    expect(config.PORT).toBeDefined();
  });

  it('throw error if missing required env', () => {
    function captureErrorOnLoadEnv() {
      const defaults = {
        TEST_ENV: null,
      };

      const currentEnv = {};

      verifyEnv(defaults, currentEnv);
    }

    expect(captureErrorOnLoadEnv).toThrow();
  });
});
