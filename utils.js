'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('is-scaffold');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('expand-target', 'Target');

/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
