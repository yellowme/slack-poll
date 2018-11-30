const fs = require('fs')

module.exports = function (url, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(`../__mockData__/${url}.json`, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}
