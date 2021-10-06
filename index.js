const path = require('path')
const fs = require('fs-extra')

const configFile = path.join(process.cwd(),'require-or-mock-config.js')
const config = fs.existsSync(configFile) ? require(configFile) : {}

function requireOrMock(filepath, create, content) {
  const absolutePath = path.join(process.cwd(), filepath)
  if (create === true) {
    if (fs.existsSync(absolutePath)) {
      return absolutePath
    } else {
      if (typeof content === 'object') {
        fs.ensureDirSync(path.dirname(absolutePath))
        fs.writeFileSync(absolutePath, JSON.stringify(content, null, 2))
        return absolutePath
      } else if (typeof content === 'string') {
        fs.ensureDirSync(path.dirname(absolutePath))
        fs.writeFileSync(absolutePath, content)
        return absolutePath
      } else {
        throw new Error('Wrong parameters')
      }
    }
  }
  let module
  try {
    module = require(absolutePath)
    return module
  } catch (e) {
    content = create
    if (typeof content === 'object') {
      return content
    } else {
      return config[filepath] || {}
    }
  }
}

module.exports = requireOrMock
