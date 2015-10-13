'use strict';

var async = require('async');

module.exports = function (app) {
  app.define('resolvers', {});
  app.define('resolverKeys', []);
  app.define('resolver', function (name, fn) {
    if (arguments.length === 1) {
      return this.resolvers[name];
    }

    if (this.resolverKeys.indexOf(name) === -1) {
      this.resolverKeys.push(name);
    }
    this.resolvers[name] = fn;
    return this;
  });

  app.define('resolve', function (key, version) {
    var len = app.resolverKeys.length, i = 0;
    var installer;
    while(len-- && !installer) {
      var resolver = app.resolvers[app.resolverKeys[i++]];
      installer = resolver(key, version);
    }
    return installer;
  });
}
