var ANSI = require('./codepage');

var GedcomTree = {
  parse: function (blob, doneCb) {
    var self = this;
    this.parseHierarchy(blob, function (gedcom) {
      var charset = gedcom.HEAD.CHAR.value,
          lang = gedcom.HEAD.LANG.value;
      if (charset == 'ANSEL' || charset == 'ANSI') {
        self.fromAnsiEncoding(gedcom, lang, doneCb);
      } else {
        doneCb(gedcom);
      }
    });
  },
  fromAnsiEncoding: function (gedcom, language, doneCb) {
    this.traverseTree(gedcom, function(node) {
      node.value = ANSI.decodeFromLanguage(node.value,
                                           language);
    }, doneCb);
    if (doneCb) {
      doneCb(gedcom);
    }
  },
  traverseTree: function (gedcom, nodeCb, doneCb) {
    var traverseNode = function(node, nodeCb) {
      for (key in node) {
        if (typeof node[key] != 'string' && key != 'value') {
          nodeCb(node[key]);
          traverseNode(node[key], nodeCb)
        }
      }
    };
    traverseNode(gedcom, nodeCb);
    if (doneCb) {
      doneCb(gedcom);
    }
  },
  parseHierarchy: function (blob, doneCb) {
    var gedcom = {},
        reg = new RegExp("(^[0-2]) ([A-Z]{4}) ?(.*)"),
        key, value, prevIndent = 0, curNode = gedcom, prevNode, curPar = [];
    this.iterateLines(blob, function(line) {
      match = reg.exec(line)
      indent = match[1];
      key = match[2];
      value = match[3];
      if (indent > prevIndent) {
        curNode = prevNode;
        curPar.push(curNode);
      } else if (indent < prevIndent) {
        curPar.pop();
        curNode = curPar.pop();
      }
      prevNode = {value: value};
      curNode[key] = prevNode;
      prevIndent = indent;
    }, function done() {
      doneCb(gedcom);
    });
    return gedcom;
  },
  iterateLines: function (arrayBuffer, onLineCallback, done) {
    var view = new Uint8Array(arrayBuffer),
        lineOffset = 0,
        curLine = "",
        CR = '\r'.charCodeAt(0),
        LF = '\n'.charCodeAt(0);
    for (var i = 0; i < arrayBuffer.byteLength; ++i) {
      if (view[i] == LF || view[i] == CR) {
        curLine = String.fromCharCode.apply(null, view.subarray(lineOffset, i));
        onLineCallback(curLine);
        if (view[i + 1] == LF || view[i + 1] == CR) {
          i += 2;
        }
        lineOffset = i + 1;
      }
    }
    if (done) {
      done();
    }
  }
}

module.exports = GedcomTree;
