'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('async');
require('ansi-red', 'red');
require('load-pkg', 'pkg');
require('parse-github-url');
require('ansi-gray', 'gray');
require('ansi-green', 'green');
require('mixin-deep', 'merge');
require('object.pick', 'pick');
require('object.reduce', 'reduce');

require('./transforms', 'transforms');
require('./loaders', 'loaders');


utils.resolveGithubUri = function (str) {
  //https://raw.githubusercontent.com/doowb/handlebars-helpers/docs/manifest.json
  var url = "https://raw.githubusercontent.com/";
  var obj = utils.parseGithubUrl(str);
  if (!obj.user || !obj.repo) {
    throw new Error('Invalid github repository');
  }
  return url += obj.repopath + '/' + obj.branch;
};


/**
 * Returns an object of defaults. Called as a
 * method to ensure a new object is created and no
 * references are kept between metadata instances.
 *
 * @return {Object} defaults
 */

var defaults = function () {
  return {
    name: '',
    description: '',
    version: '0.1.0',
    homepage: '',
    repository: '',
    authors: [],
    license: 'MIT',
    dependencies: {},
    targets: {}
  };
};

/**
 * Set default properties on the scaffolds cache.
 *
 * @param  {Object} `scaffolds` scaffolds instance
 * @return {Object} scaffolds instance
 */

utils.defaultProperties = function (scaffolds) {
  var obj = utils.merge({}, defaults(), scaffolds.cache);
  return scaffolds.set(obj);
};

require = fn;
module.exports = utils;
