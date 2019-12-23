const StatusController = {
  index(_, res) {
    return res.json({ on: true });
  },
};

module.exports = StatusController;
