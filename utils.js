function chunkArray (array, limit, res = []) {
  if (!limit) throw new Error('No chunk size defined')
  if (array.length === 0) return res
  return chunkArray(array.slice(limit, array.length), limit, [...res, array.slice(0, limit)])
}

function escapeRegExp (str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

function replaceAll (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

function cleanDoubleQuotes (text) {
  return replaceAll(replaceAll(text, '\u201D', '"'), '\u201C', '"')
}

module.exports = {
  chunkArray,
  replaceAll,
  cleanDoubleQuotes
}
