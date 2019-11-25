function createStatusController() {
  const getPing = createGetPing();
  return { getPing };
}

function createGetPing() {
  return function getPing(_, res) {
    return res.json({ on: true });
  };
}

module.exports = createStatusController;
