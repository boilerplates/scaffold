var path = require('path');
var red = require('ansi-red');
var extname = require('gulp-extname');
var through = require('through2');
var assemble = require('assemble');

var Page = assemble.get('Page');


assemble.task('loaders', function (done) {
  assemble.config({
    base: 'fixtures/templates',
    renameKey: function (key) {
      return path.basename(key, path.extname(key));
    },
    templates: {
      pages: {
        base: 'pages',
        patterns: '*.hbs',
        options: {},
      },
      posts: {
        base: 'posts',
        patterns: '*.md',
        options: {},
      },
      layouts: {
        base: 'layouts',
        patterns: '*.hbs',
        options: { viewType: 'layout' },
      },
      includes: {
        base: 'includes',
        patterns: '*.hbs',
        options: { viewType: 'partial' },
      }
    }
  }, done);
});

assemble.task('docs', ['loaders'], function () {
  return assemble.src('fixtures/templates/pages/*.hbs')
    .pipe(through.obj(function (file, enc, cb) {
      assemble.renderFile(new Page(file), cb);
    }))
    .on('error', console.error)
    .pipe(extname())
    .pipe(assemble.dest('_gh_pages'))
});

assemble.task('default', ['loaders', 'docs']);

// console.log(assemble)
