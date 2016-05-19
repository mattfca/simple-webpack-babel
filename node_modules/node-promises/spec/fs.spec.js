var nodePromise = require('../index.js');
var fs = nodePromise('fs');

describe('filesystem', function() {
  var rand;

  beforeEach(function() {
    // create random name for folder, files and etc
    rand = Math.floor(Math.random() * 100000) + '';
  });

  it('Should check if current folder exists', function(done) {
    fs.existsPromise('.') //check if the current folder exists
    .spread(function(exists) {
      expect(exists).toBe(true);
      if (exists) {
        done();
      } else {
        throw new Error('The current folder does not exists?');
      }
    });
  });

  it('Should create folder', function(done) {
    fs.mkdirPromise(rand)
    .spread(function() {
      return fs.existsPromise(rand);
    })
    .spread(function(exists) {
      expect(exists).toBe(true);
      fs.rmdirSync(rand);
      done();
    });
  });

  it('Should remove folder', function(done) {
    fs.mkdirPromise(rand)
    .spread(function() {
      return fs.existsPromise(rand);
    })
    .spread(function(exists) {
      expect(exists).toBe(true);
      return fs.rmdirPromise(rand);
    })
    .spread(function() {
      return fs.existsPromise(rand);
    })
    .spread(function(exists) {
      expect(exists).toBe(false);
      done();
    });
  });

  it('Should rename folder name', function(done) {
    fs.mkdirPromise(rand)
    .spread(function() {
      return fs.existsPromise(rand);
    })
    .spread(function(exists) {
      expect(exists).toBe(true);
      return fs.renamePromise(rand, rand + '-renamed');
    })
    .spread(function() {
      return fs.existsPromise(rand + '-renamed');
    })
    .spread(function(exists) {
      fs.rmdirSync(rand + '-renamed');
      expect(exists).toBe(true);
      done();
    });
  });
});
