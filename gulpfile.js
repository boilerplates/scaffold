var gulp = require('gulp');
var File = require('vinyl');
var async = require('async');
var writeFile = require('write');
var mocha = require('gulp-mocha');
var through = require('through2');
var minimist = require('minimist');
var jshint = require('gulp-jshint');
var istanbul = require('gulp-istanbul');
var stylish = require('jshint-stylish');

var App = require('./');
var Scaffold = App.Scaffold;

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

gulp.task('init', function (done) {
  var app = new App();
  app.init();
  app.scaffolds.addDependencies({
    project: 'doowb/scaffold-project',
    // assemblefile: 'doowb/scaffold-assemblefile',
    // docs: 'doowb/scaffold-docs',
    // gulpfile: 'doowb/scaffold-gulpfile',
    // tests: 'doowb/scaffold-tests',
    // verbmd: 'doowb/scaffold-verbmd',
  });
  writeFile('manifest.json', JSON.stringify(app.scaffolds, null, 2), done);
});

gulp.task('install', function (done) {
  var app = new App();

  var scaffolds = app.Scaffolds();
  scaffolds.load(require('./manifest.json'));

  app.init(scaffolds.toJSON());
  function cb (err, scaffolds) {
    if (err) return done(err);
    writeFile('manifest.json', JSON.stringify(app.scaffolds, null, 2), done);
  }

  var args = minimist(process.argv.slice(2), {alias: {d: 'dep'}});
  if (args.dep) {
    return app.install(args.dep, cb);
  }
  app.install(cb);
});

gulp.task('clear:cache', function (done) {
  var app = new App();
  app.store.del({force: true});
  process.nextTick(done);
});

gulp.task('specs', function (done) {
  var app = new App();
  var metadata = app.get('jonschlinkert/base-methods#manifest');
  if (!metadata) return done();

  var specs = metadata.target('specs');
  if (!specs) return done();

  async.each(specs.files, function (file, next) {
    gulp.src(file.src, {cwd: metadata.options.cwd})
      .pipe(gulp.dest(file.dest))
      .on('error', next)
      .on('end', next);
  }, done);
});

var lint = ['index.js', 'lib/**/*.js'];

gulp.task('coverage', function () {
  return gulp.src(lint)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['coverage'], function () {
  return gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.writeReports({
      reporters: [ 'text' ],
      reportOpts: {dir: 'coverage', file: 'summary.txt'}
    }))
});

gulp.task('lint', function () {
  return gulp.src(lint.concat('test/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['lint', 'test']);
