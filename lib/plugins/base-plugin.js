'use strict';

module.exports = function (app) {
  app.define('plugins', []);
  app.mixin('use', function (fn) {
    var plugin = fn.call(this, this, this.options);
    if (typeof plugin === 'function') {
      this.plugins.push(plugin);
    }
    return this;
  });

  app.mixin('run', function(obj) {
    var len = this.plugins.length, i = 0;
    while (len--) {
      var plugin = this.plugins[i++];
      if (typeof obj.use === 'function') {
        obj.use(plugin);
      } else {
        plugin.call(obj, obj, this.options);
      }
    }
  });
};
