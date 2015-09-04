

```js
function component(name) {
  return new Scaffold(name, {
    options: {cwd: 'scaffolds', flatten: true, destBase: },
    src: ['**/component.*'],
    rename: function(dest, src, opts) {
      return 
    }
  });
}
```


```sh
.
├── scaffoldfile.js
├── src/
│   ├── scripts/
│   │   └── component.js
│   ├── styles/
│   │   └── component.css
│   └── templates/
│       └── component.hbs
└── dest
    └── button/
        └── index.css
        └── index.hbs
        └── index.js
```