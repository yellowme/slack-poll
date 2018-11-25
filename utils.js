function escapeRegExp (str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
}

function replaceAll (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

function cleanDoubleQuotes (text) {
  return replaceAll(replaceAll(text, '\u201D', '"'), '\u201C', '"')
}

module.exports = {
  replaceAll,
  cleanDoubleQuotes
}
