const path = require('path')
const fs = require('fs-extra')
let config

function write(absolutePath, content) {
  fs.ensureDirSync(path.dirname(absolutePath))
  fs.writeFileSync(absolutePath,
    typeof content === 'string'
      ? content :
      JSON.stringify(content, null, 2)
  )
}

function checkMock(mock) {
  if (!~['undefined', 'object', 'string'].indexOf(typeof mock)) {
    throw new Error('Wrong mock format passed')
  }
}

function loadConfig() {
  if (typeof config === 'undefined') {
    const configFile = path.join(process.cwd(), 'require-or-mock-config.js')
    config = fs.existsSync(configFile) ? require(configFile) : {}
  }
}

function requireOrMock(filepath, ...params) {
  loadConfig()
  const absolutePath = path.join(process.cwd(), filepath)
  let [returnPathOnly, mock] = params || []
  if (returnPathOnly && returnPathOnly !== true) {
    let tmp = mock
    mock = returnPathOnly
    returnPathOnly = tmp
  }
  checkMock(mock)
  if (returnPathOnly === true) {
    if (!fs.existsSync(absolutePath)) {
      write(absolutePath, mock || config[filepath] || {})
    }
    return absolutePath
  } else {
    let module
    try {
      module = require(absolutePath)
      return module
    } catch (e) {
      if (typeof mock === 'object') {
        return mock
      } else {
        return config[filepath] || {}
      }
    }
  }
}

function requireModule(filePath, mock) {
  checkMock(mock)
  return requireOrMock(filePath, mock)
}

function requirePath(filePath, mock) {
  checkMock(mock)
  return requireOrMock(filePath, true, mock)
}

module.exports = requireOrMock
module.exports.requireModule = requireModule
module.exports.requirePath = requirePath

