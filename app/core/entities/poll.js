const PollMode = {
  SINGLE: 's',
  MULTIPLE: 'm',
};

function Poll({ id, options, owner, question, mode = PollMode.SINGLE }) {
  return {
    id,
    mode,
    options,
    owner,
    question,
  };
}

Poll.PollMode = PollMode;

module.exports = Poll;
