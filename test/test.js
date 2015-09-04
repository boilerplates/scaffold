'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var Scaffold = require('../');
var scaffold;

describe('scaffold', function () {
  describe('constructor:', function () {
    it('should throw an error when config is not an object:', function () {
      (function () {
        new Scaffold();
      }).should.throw('expected config to be an object.');
    });

    it('should throw an error when properties are missing:', function () {
      (function () {
        new Scaffold({});
      }).should.throw('scaffolds should have a src, dest or files property.');
    });

    it('should return an instance of Scaffold:', function () {
      scaffold = new Scaffold('foo', {src: 'foo'});
      assert(scaffold instanceof Scaffold);
    });

    it('should return an instance of Scaffold without new:', function () {
      scaffold = Scaffold('foo', {src: 'foo'});
      assert(scaffold instanceof Scaffold);
    });
  });

  describe('instance:', function () {
    it('should create a scaffold:', function () {
      var scaffold = new Scaffold({
        cwd: 'test/templates',
        src: '[a-c].txt'
      });

      assert(typeof scaffold.options === 'object');
      assert(Array.isArray(scaffold.files));
      assert(scaffold.files.length > 0);
    });

    it('should support passing `src` as a string:', function () {
      var scaffold = new Scaffold('test/templates/[a-c].txt');
      assert(scaffold.files.length > 0);
    });

    it('should support passing `src` as an array:', function () {
      var scaffold = new Scaffold(['test/templates/[a-c].txt']);
      assert(scaffold.files.length > 0);
    });

    it('should support passing options as the third argument:', function () {
      var scaffold = new Scaffold('[a-c].txt', {cwd: 'test/templates'});
      assert(scaffold.files.length > 0);
    });

  });
  describe('options.process:', function () {
    it('should process config templates:', function () {
      var scaffold = new Scaffold('<%= foo %>', {
        process: true,
        foo: 'bar'
      });
      assert(scaffold.files[0].src[0] === 'bar');
    });
  });
});
