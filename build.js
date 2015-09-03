'use strict';

var path = require('path');
var scaffold = require('./')();
var placeholders = require('placeholders')();
var Composer = require('composer');
var through = require('through2');
var writeFile = require('write');
var vfs = require('vinyl-fs');

function Generate(options) {
  this.options = options || {};
  this.composer = new Composer('generate');
}

// generate.task('component', config);
Generate.prototype.task = function(name, config) {
  this.composer.task(name, this.taskFactory(config));
  return this;
};

Generate.prototype.taskFactory = function(config) {
  var self = this;
  return config.files.map(function (file) {
    return function () {
      console.log(file);
      return self.src(file.src, file.options)
        .on('data', console.log)
        // .pipe(config.pipeline(config))
        .pipe(self.dest(file.dest, file.options));
    };
  });
};

Generate.prototype.run = function(name, cb) {
  this.composer.run(name, cb);
  return this;
};

Generate.prototype.src = function(glob, options) {
  return vfs.src(glob, options);
};

Generate.prototype.dest = function(dest, options) {
  return through.obj(function (file, enc, cb) {
    writeFile(dest, file.contents.toString(), cb);
  });
};

// Generate.prototype.dest = function(dest, options) {
//   return options.expand ?
//     write.stream(dest, options): // use destPath
//     vfs.dest(dest, options);
// };

function permalink(dest) {
  return placeholders(dest, this);
}

scaffold.register('baz', {
  options: {
    expand: false,
    cwd: 'test/templates',
    rename: permalink
    // rename: function (dest) {
    //   return dest;
    // }
  },
  files: {
    src: '[a-c].txt',
    dest: 'test/actual/:name.js'
  }
});

var generate = new Generate();

generate.task('baz', scaffold.cache.baz);
// console.log(generate.composer.tasks.baz.fn.toString());

generate.run('baz', function (err, res) {
  if (err) console.error('ERROR', err);
  console.log('done!');
});
