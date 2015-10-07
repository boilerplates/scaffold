/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base-methods').namespace('cache');
var option = require('base-options');

var plugin = require('./lib/plugins/base-plugin');
var Scaffolds = require('./lib/scaffolds');
var Scaffold = require('./lib/scaffold');
var plugins = require('./lib/plugins');

function App (options) {
  if (!(this instanceof App)) {
    return new App(options);
  }
  Base.call(this);
  this.options = options || {};
  this.use(option);
  this.use(plugin);
  this.use(plugins);
  this.define('Scaffold', Scaffold);
  this.define('Scaffolds', Scaffolds);
}

Base.extend(App);

App.Scaffold = Scaffold;
App.Scaffolds = Scaffolds;

module.exports = App;
