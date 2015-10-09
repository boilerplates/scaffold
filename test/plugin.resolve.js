var capture = require('capture-stream');
var request = require('request');
var assert = require('assert');
var should = require('should');
var sinon = require('sinon');

var utils = require('../lib/utils');
var App = require('../');

describe('resolve plugin', function () {
  it('should resolve specified dependency:', function (done) {
    var restore = capture(process.stdout);
    var app = new App();
    app.resolve('doowb/scaffold-assemblefile', function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-assemblefile'), -1);
      assert.equal(output.indexOf('Warning'), -1);
      done();
    });
  });

  it('should resolve an object of dependencies:', function (done) {
    var app = new App();
    var restore = capture(process.stdout);
    app.resolve({
        'doowb/scaffold-assemblefile': 'doowb/scaffold-assemblefile',
        'doowb/scaffold-gulpfile': 'doowb/scaffold-gulpfile',
      }, function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-assemblefile'), -1);
      assert.notEqual(output.indexOf('doowb/scaffold-gulpfile'), -1);
      assert.equal(output.indexOf('Warning'), -1);
      done();
    });
  });

  it('should give a warning when dependency is not found:', function (done) {
    var app = new App();
    var restore = capture(process.stdout);
    app.resolve('doowb/scaffolds-assemblefile', function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.notEqual(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('doowb/scaffolds-assemblefile'), -1);
      assert.notEqual(output.indexOf('Warning'), -1);
      assert.notEqual(output.indexOf('Not Found'), -1);
      done();
    });
  });

  it('should give a warning when given an invalid github repo is not found:', function (done) {
    var app = new App();
    var restore = capture(process.stdout);
    app.resolve('doowb', function (err, scaffolds) {
      var output = restore(true);
      if (err) return done(err);
      assert.equal(output.indexOf('Downloading'), -1);
      assert.notEqual(output.indexOf('Warning'), -1);
      assert.notEqual(output.indexOf('Invalid github repository'), -1);
      assert.notEqual(output.indexOf('doowb'), -1);
      done();
    });
  });

  describe('resolve error', function () {
    before(function(){
      sinon
        .stub(request, 'get')
        .yields(new Error('Fake Error'), null, null);
    });

    after(function(){
      request.get.restore();
    });

    it('should get a fake error from resolve', function (done) {
      var app = new App();
      var restore = capture(process.stdout);
      app.resolve('doowb/scaffold-project', function (err, scaffolds) {
        var output = restore(true);
        if (err) {
          assert.equal(typeof err.notFound, 'undefined');
          assert.equal(err.message, 'Error: Fake Error');
          return done();
        }
        done(new Error('Expected an error'));
      });
    });
  });

  describe('save error', function () {
    var app;
    before(function(){
      app = new App();
      sinon
        .stub(app, 'save')
        .yields(new Error('Fake Error'), null);
    });

    after(function(){
      app.save.restore();
    });

    it('should get a fake error from save', function (done) {
      var restore = capture(process.stdout);
      app.resolve('doowb/scaffold-project', function (err, scaffolds) {
        var output = restore(true);
        if (err) {
          assert.equal(typeof err.notFound, 'undefined');
          assert.equal(err.message, 'Fake Error');
          return done();
        }
        done(new Error('Expected an error'));
      });
    });
  });
});
