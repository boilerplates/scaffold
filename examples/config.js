'use strict';

var path = require('path');
var extend = require('extend-shallow');
var App = require('template');
var app = new App();


app.mixin('config', require('template-config')(app));

app.config({
  base: 'fixtures/scaffolds',
  renameKey: function (key) {
    return path.basename(key);
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
});

app.mixin('scaffold', function (name, scaffold) {
  this.scaffolds = this.scaffolds || {};
  this.scaffolds[name] = scaffold;
  return this;
});

app.scaffold('section', function () {
  return {
    page: app.pages.get('index.hbs'),
    layout: app.layouts.get('default.hbs'),
  }
});

app.mixin('getScaffold', function (name) {
  var scaffold = this.scaffolds[name];
  for (var key in scaffold) {
    if (scaffold.hasOwnProperty(key)) {
      if (typeof scaffold[key] === 'function') {
        fn.call(this);
      } else {

      }
    }
  }
});

console.log(app);
