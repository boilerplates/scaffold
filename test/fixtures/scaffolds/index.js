'use strict';

var fs = require('fs');
var path = require('path');
var Scaffold = require('../../');
var scaffold = new Scaffold();

/**
 * Create scaffold `category`
 */

scaffold.register('category');
scaffold.category.create('pages');
scaffold.category.pages('fixtures/scaffolds/pages/*.hbs');

/**
 * Create scaffold `section`
 */

scaffold.register('section');
scaffold.section.config({
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


console.log(scaffold);
