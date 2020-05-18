const createPoll = require('../services/createPoll');
const createPollAnswer = require('../services/createPollAnswer');
const deletePoll = require('../services/deletePoll');
const fetchPoll = require('../services/fetchPoll');
const fetchPollAnswers = require('../services/fetchPollAnswers');
const updatePoll = require('../services/updatePoll');

module.exports = function services(req, res, next) {
  // Attatch useCases
  req.services = {
    createPoll,
    createPollAnswer,
    deletePoll,
    fetchPoll,
    fetchPollAnswers,
    updatePoll,
  };

  return next();
};
