var repeat = require('repeat-string');
var inspect = require('stringify-object');


module.exports = function stringify(config) {
  var obj = inspect(config, {
    singleQuotes: true,
    indent: '  '
  });
  return fixIndent(obj);
};


function fixIndent(str) {
  str = indentArray(str);

  var lines = str.split('\n');
  var len = lines.length, i = -1;

  while (++i < len) {
    var prev = lines[i - 1];
    var line = lines[i];
    var next = lines[i + 1];

    if (isBody(line, prev)) {
      var lineIndent = indentAmount(line);
      var prevIndent = indentAmount(prev);
      lines[i] = repeat(' ', prevIndent + 2) + line.trim();
      if (/^\s+}/.test(next)) {
        lines[i + 1] = repeat(' ', prevIndent) + next.trim();
      }
    }
  }
  return lines.join('\n');
}

function isBody(curr, prev) {
  return /^\s*return/.test(curr) && /\{\s*$/.test(prev);
}

function indentAmount(str) {
  var m = str.match(/^(\s+)/);
  return m ? m[1].length : 0;
}

function indentArray(str, n) {
  var re = /src: \[[\s\n]+'([^\n\]]+)'[\n\s]+\]/g;
  var m;
  while (m = re.exec(str)) {
    str = str.split(m[0]).join('src: [\'' + m[1] + '\']');
  }
  return str;
}
