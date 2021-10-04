const {assert} = require('chai')
const path = require('path')
const fs = require('fs-extra')
let requireOrMock

describe('require-or-mock', async function () {

  const tmpDir = path.join(process.cwd(), 'tmp')

  before(async function(){
    const configSample = await fs.readFile(path.resolve(__dirname, 'fixtures/require-or-mock-config.js'), 'utf8')
    await fs.writeFile(path.join(process.cwd(), 'require-or-mock-config.js'), configSample)
    requireOrMock = require('..')
  })

  after(async function () {
    await fs.unlink(path.join(process.cwd(), 'require-or-mock-config.js'))
  })

  describe('Load module', function () {

    it('should return the existing module', function () {

      const SomeModule = requireOrMock('test/someModule.js')
      const someModule = new SomeModule
      assert.equal(someModule.hello('Francesco'), 'Hello Francesco')

    })

    it('should return a mock from the config file', function () {

      const someMissingModule = requireOrMock('lib/someMissingModule.js')
      assert.equal(someMissingModule.hello('Francesco'), 'Hello')

    })

    it('should return a mock from a passed value ', function () {

      const someOtherMissingModule = requireOrMock('lib/someOtherMissingModule.js', {
        hello: 'Ciao'
      })
      assert.equal(someOtherMissingModule.hello, 'Ciao')

    })

    it('should return an empty object if not value passed', function () {

      const someOtherMissingModule = requireOrMock('lib/someOtherMissingModule.js')
      assert.equal(Object.keys(someOtherMissingModule).length, 0)

    })

    it('should return an empty array if specified as mock', function () {

      const someOtherMissingModule = requireOrMock('lib/someOtherMissingModule.js', [])
      assert.equal(someOtherMissingModule.length, 0)

    })
  })

  describe('Create missing module', function () {

    it('should create a missing but needed JSON file', function () {

      const someJSON = {
        nick: 'gero'
      }

      const some = require(requireOrMock(`tmp/someJSON.json`, true, someJSON))
      assert.equal(some.nick, 'gero')

    })

    it('should create a missing but needed JS module', function () {

      const someJS = `module.exports = {
        hello: n => 'hello '+ n
      }`

      requireOrMock(`tmp/someJS.js`, true, someJS)
      const some = require('../tmp/someJS')
      assert.equal(some.hello('Francesco'), 'hello Francesco')

    })

    it('should create a missing but needed JS module', function () {

      const someJS = `module.exports = {
        hello: n => 'hello '+ n
      }`

      // we create it
      requireOrMock(`tmp/someJS.js`, true, someJS)
      // the mock file exists
      const some = require(requireOrMock('tmp/someJS.js', true, someJS))
      assert.equal(some.hello('Francesco'), 'hello Francesco')

    })
  })
})
