module.exports = function chunkArray(array, limit = 0, res = []) {
  if (array.length === 0) return res;
  return chunkArray(array.slice(limit, array.length), limit, [
    ...res,
    array.slice(0, limit),
  ]);
};
