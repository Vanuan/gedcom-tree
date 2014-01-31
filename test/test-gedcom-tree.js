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

test('iterate lines serapated', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/lines_separated.txt', enc='base64')),
      lines = [];
  gedcomTree.iterateLines(buffer, function (line) {
    lines.push(line);
  }, function done() {
    t.deepEqual(lines, ['1','','','2','','3']);
    t.end();
  });
});

test('parse individual', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/indi.ged', enc='base64'));
  gedcomTree.parse(buffer, function (gedcom) {
    t.deepEqual(gedcom,
      {"HEAD":{"value":"","GEDC":{"value":"","VERS":{"value":"5.5"},"FORM":{"value":"LINEAGE-LINKED"}},"CHAR":{"value":"ANSI"},"LANG":{"value":"Russian"},"SOUR":{"value":"FAMILYSPACE","NAME":{"value":"FamilySpace - территория родственников"},"VERS":{"value":"v.0.4.1d"},"CORP":{"value":"FamilySpace.ru"}}},"INDI@I1@":{"value":"","NAME":{"value":"Jane /Smith/","GIVN":{"value":"Jane"},"SURN":{"value":"Smith"},"_MARN":{"value":"Johnson"}},"SEX":{"value":"F"},"BIRTH":{"value":"","DATE":{"value":"2 January 1903"},"PLAC":{"value":""}},"FAMC":{"value":"@F1@"}}}
    );
    t.end();
  });
});

test('parse several individuals', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/indi2.ged', enc='base64'));
  gedcomTree.parse(buffer, function (gedcom) {
    t.deepEqual(gedcom,
      {"HEAD":{"value":"","GEDC":{"value":"","VERS":{"value":"5.5"},"FORM":{"value":"LINEAGE-LINKED"}},"CHAR":{"value":"ANSI"},"LANG":{"value":"Russian"},"SOUR":{"value":"FAMILYSPACE","NAME":{"value":"FamilySpace - территория родственников"},"VERS":{"value":"v.0.4.1d"},"CORP":{"value":"FamilySpace.ru"}}},"INDI@I1@":{"value":"","NAME":{"value":"Jane /Smith/","GIVN":{"value":"Jane"},"SURN":{"value":"Smith"},"_MARN":{"value":"Johnson"}},"SEX":{"value":"F"},"BIRTH":{"value":"","DATE":{"value":"2 January 1903"},"PLAC":{"value":""}},"FAMC":{"value":"@F1@"}},"INDI@I2@":{"value":"","NAME":{"value":"John /Smith/","GIVN":{"value":"John"},"SURN":{"value":"Smith"}},"SEX":{"value":"M"},"FAMS":{"value":"@F1@"}}}
    );
    t.end();
  });
});


test('parse torture test files', function (t) {
  var buffer = fromBase64(fs.readFileSync('test/TGC551.ged', enc='base64'));
  gedcomTree.parse(buffer, function (gedcom) {
    t.deepEqual(gedcom["INDI@I11@"],
      {"value":"","NAME":{"value":"General Custom /Filelinks/"},"SEX":{"value":"M"},"BIRT":{"value":"","DATE":{"value":"1872"}},"DEAT":{"value":"","DATE":{"value":"7 DEC 1941"}},"FAMC":{"value":"@F5@"},"NOTE":{"value":"@N22@"},"OBJE":{"value":"","FORM":{"value":"PDF"},"TITL":{"value":"Portable document format file"},"FILE":{"value":"Document.pdf"}},"CHAN":{"value":"","DATE":{"value":"11 Jan 2001","TIME":{"value":"16:01:03"}}},"RIN":{"value":"5"}}
);
    t.end();
  });
});
