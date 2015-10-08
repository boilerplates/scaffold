'use strict';

module.exports = function (app) {
  app.mixin('get', function (name) {
    var metadata = this.store.get(name);
    if (!metadata) return null;
    var scaffolds = app.Scaffolds();
    scaffolds.load(metadata.manifest);
    scaffolds.option(metadata.options);
    return scaffolds;
  });

  app.mixin('set', function (name, scaffolds) {
    var metadata = {
      options: scaffolds.options || {},
      manifest: scaffolds.toJSON()
    };
    this.store.set(name, metadata);
    return this;
  });
};
