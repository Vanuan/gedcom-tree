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

test('parse head with ANSI Russian', function (t) {
  var buffer = fs.readFileSync('test/head.ged');
  buffer = toArrayBuffer(buffer);
  gedcomTree.parse(buffer, function (gedcom) {
    t.deepEqual(gedcom,
{"HEAD":{"value":"","GEDC":{"value":"","VERS":{"value":"5.5"},"FORM":{"value":"LINEAGE-LINKED"}},"CHAR":{"value":"ANSI"},"LANG":{"value":"Russian"},"SOUR":{"value":"FAMILYSPACE","NAME":{"value":"FamilySpace - территория родственников"},"VERS":{"value":"v.0.4.1d"},"CORP":{"value":"FamilySpace.ru"}}}}
    );
    t.end();
  });
});

test('iterate lines lf', function (t) {
  var buffer = fs.readFileSync('test/lines_lf.txt'),
      lines = [];
  buffer = toArrayBuffer(buffer);
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','2','3']);
    t.end();
  })
});

test('iterate lines cr', function (t) {
  var buffer = fs.readFileSync('test/lines_cr.txt'),
      lines = [];
  buffer = toArrayBuffer(buffer);
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','2','3']);
    t.end();
  })
});

test('iterate lines crlf', function (t) {
  var buffer = fs.readFileSync('test/lines_crlf.txt'),
      lines = [];
  buffer = toArrayBuffer(buffer);
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','2','','3']);
    t.end();
  })
});
