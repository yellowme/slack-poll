function chunkArray(array, limit = 0, res = []) {
  if (array.length === 0) return res;
  return chunkArray(array.slice(limit, array.length), limit, [
    ...res,
    array.slice(0, limit),
  ]);
}

function arraySample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = { arraySample, chunkArray };
