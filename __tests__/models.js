const models = require('../models');

const { Poll, PollAnswer } = models;

describe('models.js', () => {
  it('Poll', async () => {
    const pollInstance = await Poll.create();
    const poll = await pollInstance.get({ plain: true });
    expect(poll.id).toBeDefined();
  });

  it('PollAnswer', async () => {
    const pollInstance = await Poll.create();
    const poll = await pollInstance.get({ plain: true });
    expect(poll.id).toBeDefined();

    const pollAnswerInstance = await PollAnswer.create({ pollId: poll.id });
    const pollAnswer = await pollAnswerInstance.get({ plain: true });
    expect(pollAnswer.id).toBeDefined();
    expect(pollAnswer.pollId).toBe(poll.id);
  });
});
