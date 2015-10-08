'use strict';

var plugins = [
  require('./log'),
  require('./init'),
  require('./save'),
  require('./store'),
  require('./install'),
  require('./resolve'),
  require('./download'),
  require('./scaffolds'),
];


module.exports = function (app) {
  var len = plugins.length, i = 0;
  while (len--) {
    app.use(plugins[i++]);
  }
};
