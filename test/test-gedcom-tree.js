var test = require('tape');
var fs = require('fs');
var gedcomTree = require('../gedcom-tree.js');

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function fromBase64(base64) {
  var buf = new Buffer(base64, 'base64');
  var buffer = toArrayBuffer(buf);
  return buffer;
}

test('parse head with ANSI Russian', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/head.ged', enc='base64'));
  gedcomTree.parse(buffer, function (gedcom) {
    t.deepEqual(gedcom,
{"HEAD":{"value":"","GEDC":{"value":"","VERS":{"value":"5.5"},"FORM":{"value":"LINEAGE-LINKED"}},"CHAR":{"value":"ANSI"},"LANG":{"value":"Russian"},"SOUR":{"value":"FAMILYSPACE","NAME":{"value":"FamilySpace - территория родственников"},"VERS":{"value":"v.0.4.1d"},"CORP":{"value":"FamilySpace.ru"}}}}
    );
    t.end();
  });
});

test('iterate lines lf', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/lines_lf.txt', enc='base64')),
      lines = [];
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','2','3']);
    t.end();
  });
});

test('iterate lines cr', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/lines_cr.txt', enc='base64')),
      lines = [];
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','2','3']);
    t.end();
  });
});

test('iterate lines crlf', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/lines_crlf.txt', enc='base64')),
      lines = [];
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','2','','3']);
    t.end();
  });
});
