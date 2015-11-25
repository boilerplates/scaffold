'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Scaffold = require('..');
var scaffold;

describe('scaffolds', function () {
  beforeEach(function() {
    scaffold = new Scaffold();
  });

  describe('targets', function () {
    it('should expose an "options" property', function () {
      scaffold.addTargets({});
      assert(scaffold.options);
    });

    it('should expose targets', function () {
      scaffold.addTargets({
        foo: {src: '*'},
        bar: {src: '*'}
      });
      assert(scaffold.foo);
      assert(scaffold.bar);
    });
  });
});
