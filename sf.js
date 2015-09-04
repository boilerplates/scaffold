'use strict';

var Scaffold = require('./');
var scaffold = new Scaffold();


scaffold.register('baz', {
  cwd: '~/foo/bar',
  src: '*.txt',
  dest: 'src/'
});

console.log(scaffold.targets.baz.files)
