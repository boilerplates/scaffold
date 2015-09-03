'use strict';

var path = require('path');
var lazy = require('lazy-cache')(require);
lazy('look-up', 'lookup');

/**
 * Generic utils.
 */

var utils = module.exports;


/**
 * Get the absolute filepath to the `main` file, if
 * specified in package.json.
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
    fp = lazy.lookup('package.json', {cwd: fp});
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
