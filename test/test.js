/*!
 * scaffold <https://github.com/jonschlinkert/scaffold>
 *
 * Copyright (c) 2015 .
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var scaffold = require('./');

describe('scaffold', function () {
  it('should:', function () {
    scaffold('a').should.eql({a: 'b'});
    scaffold('a').should.equal('a');
  });

  it('should throw an error:', function () {
    (function () {
      scaffold();
    }).should.throw('scaffold expects valid arguments');
  });
});
