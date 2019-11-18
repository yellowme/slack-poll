function createCreatePollUseCase({ messageRepository }) {
  return function createMessage(data) {
    return messageRepository.insert(data);
  };
}

module.exports = createCreatePollUseCase;
