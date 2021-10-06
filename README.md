# requireOrMock

**A replacement for `require` for when the required file could not exist**

_If you are reading this doc on npmjs.com, sometimes I notice minor glitches in the README after publishing it. In those cases, I update the repo without publishing a new version. So, refer all the time to [the README in the repo](https://github.com/sullof/require-or-mock#readme) to be sure you are updated._

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

In the example above, if the file does not exist, requireOrMock will return an empty object. A better way to manage it is to add a `require-or-mock-config.js` file in the root of the project and set up any mock you need there.
In the example above, it could be:
```
module.exports = {
  'envs/secretKeys.json': {
     someKey: '',
     someOtherKey: ''
  }
}
```
Alternatively, you can inline the mock like:

```
const requireOrMock = require('require-or-mock')
const awsConfig = requireOrMock('envs/secretKeys.json', {
  someKey: '',
  someOtherKey: ''
})
```

The inline mock has priority on the mock config file.

If no mock is specified, an empty object will be returned.

## Just 3 params

RequireOrMock accepts three params:

**moduleRelativePath** (String, mandatory)

The first, mandatory, is the path relative to the root of the project of the library we like to require.

**returnFilePathOnly** (Boolean, optional)

If true, it tells RequireOrMock to returns just the path of the module (see example below)

**mock** (Object | String, optional)

It is required only if you expect that the mocked file has specific properties and you didn't set it up in `require-or-mock-config.js`

You can pass `mock` and `returnFilePathOnly` in any order.


## Creating missing but needed files

Another common scenario is when you are loading a file that must exist.

For example, you are using aws-sdk and loading the configuration from a json file like:

```
const AWS = require('aws-sdk')
AWS.config.loadFromPath('../../awsConfig.json')
```

In this case, you can tell RequireOrMock to load the file if it exists, creating the file, if not.

To do so, you can call

```
const requireOrMock = require('require-or-mock')
const AWS = require('aws-sdk')
AWS.config.loadFromPath(requireOrMock('awsConfig.json', true, {
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2'
}))
```
After the first run, you will see that a mock file is created where needed.

Notice that the optional parameter are interchangeable and the following works as weel
```
AWS.config.loadFromPath(requireOrMock('awsConfig.json', {
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2'
}, true))
```

### The config file

You can also set the mock in `require-or-mock-config.js` as
```
module.exports = {
  'awsConfig.json': {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-2'
  }
}
```
and load it, simply, as
```
const requireOrMock = require('require-or-mock')
const AWS = require('aws-sdk')
AWS.config.loadFromPath(requireOrMock('awsConfig.json', true))
```



### A mock can be anything

For example, you can pass the source code of a JS file as a string:

```
const requireOrMock = require('require-or-mock')
const doSomething = require(requireOrMock('envConfig.js', true, `module.exports = {
{
  apiKey: 'sadkaldjewiewjekfjsdfjs',
  apiSecret: 'sa32482h74d23h84723987h238429d482982'
}
}`)
```

You can also use RequireOrMock to create any file:

```
const requireOrMock = require('require-or-mock')
requireOrMock('db/people.csv', true,
  `name,city,state
Francesco,San Francisco,CA
Mark,Austing,TX
`)
```

## License
MIT

## Copyright
(c) 2021, Francesco Sullo <francesco@sullo.co>

