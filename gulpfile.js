var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var through = require('through2');
var File = require('vinyl');
var Scaffold = require('./');

gulp.task('manifest', function () {
  var files = [];
  return gulp.src(['**/*.*', '.*', '!**/{actual,node_modules,vendor,.git}/**'])
    .pipe(through.obj(function (file, enc, cb) {
      files.push(file.relative);
      cb();
    }, function (cb) {
      var manifest = {
        targets: {
          'app1': new Scaffold('app1', {src: files, dest: 'actual/app1'}),
          'app2': new Scaffold('app1', {src: files, dest: 'actual/app2', expand: true})
        }
      };
      var file = new File({
        path: 'manifest.json',
        contents: new Buffer(JSON.stringify(manifest, null, 2))
      });
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('jshint', function() {
  return gulp.src('index.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', ['jshint'], function (cb) {
  gulp.src('index.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/test.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('default', ['test']);
