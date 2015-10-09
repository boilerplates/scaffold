var capture = require('capture-stream');
var assert = require('assert');
var should = require('should');
var App = require('../');

describe('log plugin', function () {
  it('should log to stdout:', function () {
    var restore = capture(process.stdout);
    var app = new App();
    app.log('foo');
    var output = restore(true);
    assert.equal(output, 'foo\n');
  });
});
