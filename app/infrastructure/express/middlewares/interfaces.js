const config = require('../../../config');
const createCreatePoll = require('../../../core/services/createPoll');
const createCreatePollResponse = require('../../../core/services/createPollResponse');
const createDeletePoll = require('../../../core/services/deletePoll');
const createFetchPoll = require('../../../core/services/fetchPoll');
const createFetchPollResponses = require('../../../core/services/fetchPollResponses');
const createStorePollPresenterTimestamp = require('../../../core/services/storePollPresenterTimestamp');

module.exports = function createInterfacesMiddleware({
  repositories,
  presenters,
}) {
  return function interfacesMiddleware(req, res, next) {
    // Attatch config
    req.config = config;

    // Attatch repositories
    req.repositories = repositories;

    // Attatch presenters
    req.presenters = presenters;

    // Attatch useCases
    req.useCases = {
      createPoll: createCreatePoll(repositories.pollsRepository),
      createPollResponse: createCreatePollResponse(
        repositories.pollAnswersRepository
      ),
      deletePoll: createDeletePoll(repositories.pollsRepository),
      fetchPoll: createFetchPoll(repositories.pollsRepository),
      fetchPollResponses: createFetchPollResponses(
        repositories.pollAnswersRepository
      ),
      storePollPresenterTimestamp: createStorePollPresenterTimestamp(
        repositories.pollsRepository
      ),
    };

    return next();
  };
};
