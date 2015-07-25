'use strict';

var path = require('path');
var lookup = require('look-up');

/**
 * Generic utils.
 */

var utils = module.exports;

/**
 * Get absolute filepath to the `main` file specified in package.json.
 *
 * @param  {String} `fp`
 * @return {String}
 */

utils.main = function main(fp) {
  var pkg = utils.resolvePackage(fp);
  if (pkg.hasOwnProperty('main')) {
    return path.resolve(fp, pkg.main);
  }
  return null;
};

/**
 * Resolve a globally or locally installed npm package by name.
 *
 * @param  {String} `fp`
 * @return {String}
 */

utils.resolvePackage = function resolvePackage(fp) {
  if (path.basename(fp) !== 'package.json') {
    fp = lookup('package.json', {cwd: fp});
  }
  return utils.tryRequire(path.resolve(fp));
};

/**
 * Try to require a package. If it throws, ignore the error and return
 * an empty object.
 *
 * @param  {String} `fp`
 * @return {String}
 */

utils.tryRequire = function tryRequire(fp) {
  try {
    return require(fp);
  } catch(err) {};
  return {};
};

/**
 * Delegate non-enumerable properties from `provider` to `receiver`.
 *
 * @param  {Object} `receiver`
 * @param  {Object} `provider`
 */

utils.delegate = function delegate(receiver, provider) {
  for (var method in provider) {
    utils.defineProp(receiver, method, provider[method]);
  }
};

/**
 * Add a non-enumerable property to `receiver`
 *
 * @param  {Object} `obj`
 * @param  {String} `name`
 * @param  {Function} `val`
 */

utils.defineProp = function defineProp(receiver, key, value) {
  return Object.defineProperty(receiver, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: value
  });
};
