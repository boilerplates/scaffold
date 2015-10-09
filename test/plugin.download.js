var request = require('request');
var assert = require('assert');
var should = require('should');
var sinon = require('sinon');
var App = require('../');

describe('download plugin', function () {
  describe('valid response', function () {
    before(function(){
      sinon
        .stub(request, 'get')
        .yields(null, {statusCode: 200}, JSON.stringify({foo: 'bar'}));
    });

    after(function(){
      request.get.restore();
    });

    it('should prase JSON response', function (done) {
      var app = new App();
      app.download('http://example.com/foo', function (err, data) {
        if (err) return done(err);
        assert.deepEqual(data, {foo: 'bar'});
        done();
      });
    });
  });

  describe('not found', function () {
    before(function(){
      sinon
        .stub(request, 'get')
        .yields(null, {statusCode: 404, statusMessage: 'Not Found'}, null);
    });

    after(function(){
      request.get.restore();
    });

    it('should get a not found error', function (done) {
      var app = new App();
      app.download('http://example.com/foo', function (err, data) {
        if (err) {
          assert(err.notFound);
          assert.equal(err.message, 'Not Found');
          return done();
        }
        done(new Error('Expected an error'));
      });
    });
  });

  describe('error', function () {
    before(function(){
      sinon
        .stub(request, 'get')
        .yields(new Error('Fake Error'), null, null);
    });

    after(function(){
      request.get.restore();
    });

    it('should get a not found error', function (done) {
      var app = new App();
      app.download('http://example.com/foo', function (err, data) {
        if (err) {
          assert.equal(typeof err.notFound, 'undefined');
          assert.equal(err.message, 'Error: Fake Error');
          return done();
        }
        done(new Error('Expected an error'));
      });
    });
  });

  describe('invalid json', function () {
    before(function(){
      sinon
        .stub(request, 'get')
        .yields(null, {statusCode: 200}, '<html></html>');
    });

    after(function(){
      request.get.restore();
    });

    it('should get an invalid json parse error', function (done) {
      var app = new App();
      app.download('http://example.com/foo', function (err, data) {
        if (err) {
          assert.equal(typeof err.notFound, 'undefined');
          assert.equal(err.message, 'Unexpected token <');
          return done();
        }
        done(new Error('Expected an error'));
      });
    });
  });
});
