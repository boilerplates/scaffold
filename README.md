# scaffold [![NPM version](https://badge.fury.io/js/scaffold.svg)](http://badge.fury.io/js/scaffold)

> Conventions and API for creating scaffolds that can by used by any build system or generator.

## Quickstart

**Install**

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i scaffold --save
```

**Usage**

Create a reusable scaffold from one or more templates or source files:

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold('foo', {
  // `~` tildes expand to the user's home directory
  options: {cwd: '~/scaffolds'},
  src: ['**/component*'],
  dest: 'local/src/'
});
```

Returns a normalized configuration object that can easily be used by any build system or generator. The config object returned from the above example would look something like this:

```js
{
  options: {
    cwd: '~/scaffolds'
  },
  files: [{
    name: 'foo'
    options: {cwd: '/Users/jonschlinkert/scaffolds'},
    src: ['/Users/jonschlinkert/scaffolds/scripts/component.js',
      '/Users/jonschlinkert/scaffolds/styles/component.css',
      '/Users/jonschlinkert/scaffolds/templates/component.hbs'
    ],
    dest: 'local/src/',
  }]
}
```

## Table of contents

<!-- toc -->

* [Usage](#usage)
* [Examples](#examples)
* [API](#api)
* [What is a scaffold?](#what-is-a-scaffold-)
* [Related projects](#related-projects)
* [Test coverage](#test-coverage)
* [Running tests](#running-tests)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)

_(Table of contents generated by [verb](https://github.com/verbose/verb))_

<!-- tocstop -->

## Usage

Create an instance of scaffold:

```js
var Scaffold = require('scaffold');
var foo = new Scaffold('foo', {
  // config/options here  
});
```

Scaffold uses [expand-target](https://github.com/jonschlinkert/expand-target) and [expand-files](https://github.com/jonschlinkert/expand-files) as dependencies. Visit those projects for the full range of available features and options:

## Examples

There are many different ways to create scaffolds, the possibilities are endless. The following are just a few random examples of what a scaffold could be, but don't be limited by my imagination!

**Blog post**

Create a scaffold for adding blog posts to a project:

```js
var post = new Scaffold('post', {
  options: {cwd: 'scaffolds'},
  src: 'content/post.md', 
  dest: 'src/posts/'
});
```

**UI components**

Create a scaffold for adding UI components to a project:

```js
var component = new Scaffold('component', {
  options: {cwd: 'scaffolds'},
  files: [
    {src: 'templates/component.hbs', dest: 'src/templates/'},
    {src: 'scripts/component.js', dest: 'src/scripts/'},
    {src: 'styles/component.css', dest: 'src/styles/'},
  ]
});
```

**dotfiles**

Create a scaffold for dotfiles to use when initializing new projects:

```js
var dotfiles = new Scaffold('dotfiles', {
  // glob pattern for dotfiles
  src: ['templates/.*'],
  options: {
    // filter out `.DS_Store` files
    filter: function (fp) {
      return !/\.DS_Store/.test(fp);
    }
  }
});
```

## API

### [Scaffold](index.js#L26)

Create a new Scaffold with the given `name` and `config`.

**Params**

* `name` **{String}**: The name of the scaffold.
* `config` **{Object}**: The scaffold's configuration object.

**Example**

```js
var component = new Scaffold('component', {
  src: ['~/templates/*.js']
});
```

## What is a scaffold?

Here is a quick reference comparing the difference between boilerplates, scaffolds and templates.

| **type** | **description** |
| template | Resuable file, code or content which contains "placeholder" values that will eventually be replaced with real values by a rendering (template) engine |
| [scaffold](#scaffold) | Consist of one or more templates or source files and serve as a "temporary support structure" that may be used at init, or throughout the duration of a project. |
| [boilerplate](http://boilerplates.io) | Boilerplates consist of all of the necessary files required to initialize a complete project. |

## Related projects

* [assemble](https://www.npmjs.com/package/assemble): Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt,… [more](https://www.npmjs.com/package/assemble) | [homepage](http://assemble.io)
* [boilerplate](https://www.npmjs.com/package/boilerplate): Tools and conventions for authoring and publishing boilerplates that can be generated by any build… [more](https://www.npmjs.com/package/boilerplate) | [homepage](http://boilerplates.io)
* [template](https://www.npmjs.com/package/template): Render templates using any engine. Supports, layouts, pages, partials and custom template types. Use template… [more](https://www.npmjs.com/package/template) | [homepage](https://github.com/jonschlinkert/template)

## Test coverage

As of September 12, 2015:

```
Statements   : 100% (29/29)
Branches     : 100% (18/18)
Functions    : 100% (3/3)
Lines        : 100% (28/28)
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && gulp
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/scaffold/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on September 12, 2015._
