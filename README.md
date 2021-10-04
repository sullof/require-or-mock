# require2

**A replacement for `require` for when the required file could not exist**

Often, you require files that you do not want to share in the repo. For example, if you like to configure aws-sdk using awsConfig.json, you do not share the json file. Still, you would like to load it with something like
```
const awsConfig = require('./awsConfig.json')
```
The problem there is that whoever clones the repo will have an error.
The solution is to use require2.
```
const require2 = require('require2')
const awsConfig = require2('./awsConfig.json')
```

In the example above, if the file does not exist, require2 will return an empty object. A better way to manage it is to add a `.require2.config.js` file in the root of the project and set up any mock you need there.
In the example above, it could be:
```
module.exports = {
  "awsConfig.json": {
     "accessKeyId": "",~~~~~~~~
     "secretAccessKey": "",
     "region": "us-east-2"
  }
}
```
Alternatively, you inline the mock like:

```
const require2 = require('require2')
const awsConfig = require2('./awsConfig.json', {
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": "us-east-2"
})
```

## License
MIT

## Copyright
(c) 2021, Francesco Sullo <francesco@sullo.co>

