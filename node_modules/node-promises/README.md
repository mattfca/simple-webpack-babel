# node-promises

This module add promise version to all node module functions

Example:
```js
var nodePromise = require('node-promises');
var fs = nodePromise('fs');

fs.existsPromise(__filename)
.spread(function(exists) { //exists=true
  return fs.mkdirPromise(__dirname + '/test');
}).spread(function() {
  // test folder has been created
});
```

> since the promise return the argument array of the callback you should prefer use `spread` instead `then`
