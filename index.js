const path = require('path')
const fs = require('fs')

const configFile = path.join(process.cwd(),'require2-config.js')
const config = fs.existsSync(configFile) ? require(configFile) : {}

function require2(filepath = '', mock) {
  let module
  try {
    module = require(filepath)
    return module
  } catch (e) {
    if (mock) {
      return mock
    }
    const moduleName = path.basename(filepath)
    return config[moduleName] || config[moduleName.replace(/\.\w+$/, '')] || {}
  }
}

module.exports = require2
