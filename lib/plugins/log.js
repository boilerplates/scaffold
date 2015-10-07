'use strict';

module.exports = function (app) {
  app.mixin('log', function () {
    console.log.apply(console, arguments);
  });
}
