'use strict';

module.exports = function (app) {
  var store = null;
  app.define('store', {
    get: function () {
      if (store) return store;
      var resolveDir = require('resolve-dir');
      var DataStore = require('data-store');
      store = new DataStore('scaffolds', {cwd: resolveDir('~/.scaffolds/.datastore')});
      return store;
    }
  });
};
