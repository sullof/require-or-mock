# requireOrMock

**A replacement for `require` for when the required file could not exist**

## Mocking possibly missing files

Often, you require files that you do not want to share in the repo. For example, if you like to load some secret keys to be used in a script, you do not share the file. Still, you would like to load it with something like
```
const secretKeys = require('../../envs/secretKeys.json')
```
The problem there is that whoever clones the repo will have an error.
The solution is to use requireOrMock.
```
const requireOrMock = require('require-or-mock')
const awsConfig = requireOrMock('envs/secretKeys.json')
```
(notice that the path in requireOrMock MUST be relative to the root of your project and MUST include the extension)

In the example above, if the file does not exist, requireOrMock will return an empty object. A better way to manage it is to add a `.require-or-mock.config.js` file in the root of the project and set up any mock you need there.
In the example above, it could be:
```
module.exports = {
  "envs/secretKeys.json": {
     "someKey": "",
     "someOtherKey": ""
  }
}
```
Alternatively, you inline the mock like:

```
const requireOrMock = require('require-or-mock')
const awsConfig = requireOrMock('envs/secretKeys.json', {
  "someKey": "38r32842472d823hd847328",
   "someOtherKey": "sjaieijfweifwhjeufsiufhfhwei"
})
```

If no mock is specified, an empty object will be returned.

## Creating missing but needed files

Another scenario is when you are loading a file that must exist.

For example, you are using aws-sdk and loading the configuration from a json file like:

```
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'})
AWS.config.loadFromPath('../../awsConfig.json')
```

In this case, you can tell RequireOrMock to load the file if it exists, creating the file, if not.

To do so, you can call

```
const requireOrMock = require('require-or-mock')
const AWS = require('aws-sdk')
AWS.config.loadFromPath(requireOrMock('awsConfig.json', true, {
{
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": "us-east-2"
}
}))
```
After the first run, you will see that a mock file is created where needed.

You can also pass some source code as a string. For example:

```
const requireOrMock = require('require-or-mock')
const doSomething = require(requireOrMock('awsConfig.json', true, `module.exports = {
{
  accessKeyId: '',
  hello: name => 'Hello '+ name
}
}`)
```



## License
MIT

## Copyright
(c) 2021, Francesco Sullo <francesco@sullo.co>

