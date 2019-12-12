const PollMode = {
  SINGLE: 's',
  MULTIPLE: 'm',
};

function createPoll({ id, options, owner, question, mode = PollMode.SINGLE }) {
  return {
    id,
    mode,
    options,
    owner,
    question,
  };
}

createPoll.PollMode = PollMode;

module.exports = createPoll;
