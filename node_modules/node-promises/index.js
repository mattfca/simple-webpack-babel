/*jshint loopfunc: true */
var Q = require('q');

/**
* This function add a promise to the entire liburery based on callback parameter
* @param {object} nodeLib - the liburery that we want to add to promises
* @returns {object} the lib
*/
function nodePromises(nodeLib) {
  var lib = require(nodeLib);
  var key;

  for (key in lib) { //get all the functions in the liburery
    if (key.indexOf('Sync') === -1 && lib[key].toString().indexOf('callback') > -1) {
      // check that they are not Sync and they have a callback

      // add Promise function that base on the function recived
      addPromiseFunc(key, lib, getCallbackIndex(lib[key]));
    }
  }

  return lib;
}

/**
* This function add a promise function base on the key recived
* @param {string} key - the function that we want to wrap
* @param {object} lib - the lib where the function is
* @param {number} callbackIndex - the index of the callback parameter
* @param {string} suffix - the suffix of the wrapped function
* @returns {void}
*/
function addPromiseFunc(key, lib, callbackIndex, suffix) {
  var newKey;

  if (suffix) {
    newKey = key + suffix;
  } else {
    newKey = key + 'Promise';
  }

  lib[newKey] = function() {
    var args = Array.prototype.slice.call(arguments); //get arguments in normal array
    var deferred = Q.defer();
    args[callbackIndex] = function() {
      deferred.resolve(arguments);
    };

    lib[key].apply(this, args);
    return deferred.promise;
  };
}

/**
* This function get function and return the callback index
* @param {function} func - the function we want to get callback index the parameters name from
* @returns {number} the index of the callback
*/
function getCallbackIndex(func) {
  var paramsName;
  var i;

  paramsName = getParamNames(func);
  for (i = 0; i <= paramsName.length; i++) {
    if (paramsName[i] && paramsName[i].indexOf('callback') > -1) {
      return i;
    }
  }

  return -1;
}

/**
* This function get the parameters name of a function
* {@link http://goo.gl/i2bpT|stackoverflow credit}
* @param {function} func - the function we want to get the parameters name from
* @returns {array} array of strings with parameters name
*/
function getParamNames(func) {
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
  result = [];
  return result;
}

module.exports = nodePromises;
