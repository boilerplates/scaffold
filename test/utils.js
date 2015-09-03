'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var utils = require('../lib/utils');

describe('utils', function () {
  describe('toPath', function () {
    it('should convert an array of arguments to an object path:', function () {
      utils.toPath('a', 'b', 'c').should.equal('a.b.c');
    });
    it('should convert an array of arrays to an object path:', function () {
      utils.toPath(['a'], ['b'], ['c']).should.equal('a.b.c');
    });
    it('should convert arrays and strings to an object path:', function () {
      utils.toPath('a', ['b'], 'c').should.equal('a.b.c');
    });
    it('should work with one arg:', function () {
      utils.toPath(['a']).should.equal('a');
      utils.toPath('a').should.equal('a');
    });
  });
});
