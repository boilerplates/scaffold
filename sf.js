'use strict';

var path = require('path');
var each = require('async-each');
var relative = require('relative');
var scaffold = require('./')();



scaffold.register({
  options: {
    cwd: 'test/templates',
    expand: true
  },
  component: {
    data: {base: 'src'},
    rename: function (dest, ctx) {
      return placeholders(dest, ctx);
    },
    files: [
      // `params` values are used to replace path variables
      // `data` values are used to replace template variables
      {src: 'foo/component.hbs', dest: ':base/templates/partials/:name'},
      {src: 'bar/component.less', dest: ':base/styles/components/:name'},
      {src: 'baz/component.json', dest: ':base/data/:name'},
    ]
  },
  bar: {
    files: {
      src: '[d-f].txt',
      dest: 'foo/'
    }
  }
});

scaffold.register('baz', {
  options: {
    extend: true,
    expand: false,
    concat: true,
    cwd: 'test/templates',
  },
  files: {
    src: '*.txt',
    dest: 'foo/whatever.txt'
  }
});



console.log(scaffold.cache.baz)


// scaffold new component foo -d

// function build(name, argv) {
//   var config = scaffold.get(name);

//   scaffold.generate(config, argv);
// }

// function generate(key, cb) {
//   var config = target(key);
//   var i = 0;

//   each(config.files, function (node, next) {
//       console.log(node)
//     scaffold.task(key, function (done) {
//       // scaffold.src(node.src).pipe(scaffold.dest(node.dest));
//       done();
//     });
//     next();
//   }, function (err) {
//     if (err) return cb(err);

//     scaffold.run(key, function (err) {
//       if (err) return cb(err);
//       cb();
//     })
//   });
//   return config;
// }

// generate('partials', function (err, res) {
//   console.log(res)
// });
