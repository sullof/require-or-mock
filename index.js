const path = require('path')
const fs = require('fs-extra')

const configFile = path.join(process.cwd(), 'require-or-mock-config.js')
const config = fs.existsSync(configFile) ? require(configFile) : {}

function write(absolutePath, content) {
  fs.ensureDirSync(path.dirname(absolutePath))
  fs.writeFileSync(absolutePath,
    typeof content === 'string'
      ? content :
      JSON.stringify(content, null, 2)
  )
}

function requireOrMock(filepath, ...params) {
  const absolutePath = path.join(process.cwd(), filepath)
  let [returnPathOnly, mock] = params || []
  if (returnPathOnly && returnPathOnly !== true) {
    let tmp = mock
    mock = returnPathOnly
    returnPathOnly = tmp
  }
  if (!~['undefined', 'object', 'string'].indexOf(typeof mock)) {
    throw new Error('Wrong mock format passed')
  }
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

module.exports = requireOrMock
