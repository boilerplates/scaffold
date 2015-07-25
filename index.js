/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var App = require('template');
var config = require('./template-config');
var utils = require('./lib/utils');

function Template(options) {
  var app = new App(options);
  app.mixin('config', config(app));
  return app;
}

function Scaffold(options) {
  this.options = options || {};
  this.scaffolds = {};
}

utils.delegate(Scaffold.prototype, {
  constructor: Scaffold,

  register: function (name, options) {
    this[name] = new Template(options);
    return this;
  }
});


/**
 * Expose `Scaffold`
 */

module.exports = Scaffold;
