function getPing(_, res) {
  return res.json({ on: true });
}

module.exports = {
  getPing,
};
