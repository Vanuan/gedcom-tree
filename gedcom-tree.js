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
        reg = new RegExp("(^[0-2]) (?:(@[A-Z0-9]*@) )?(_?[A-Z]{3,5}) ?(.*)"),
        key, value, indent = 0, prevIndent = 0, curNode = gedcom, prevNode, curPar = [];
    this.iterateLines(blob, function(line) {
      if (line.length == 0) return; // skip empty
      //console.log("paren" + curPar.length + " " + JSON.stringify(curPar));
      //console.log("indent" + indent);
      //console.log("cur" + JSON.stringify(curNode));
      //console.log(line)
      match = reg.exec(line)
      if(match == undefined) {
        throw "can't parse line" + line;
      }
      indent = match[1];
      if (match[2] != undefined) {
        key = match[3] + match[2];
      } else {
        key = match[3];
      }
      value = match[4];
      if (indent > prevIndent) {
        curPar.push(curNode);
        curNode = prevNode;
        //console.log(">")
      } else if (indent < prevIndent) {
        curNode = curPar.pop();
        //console.log("<")
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
      //console.log(view[i])
      if (view[i] == LF || view[i] == CR) {
        curLine = String.fromCharCode.apply(null, view.subarray(lineOffset, i));
        onLineCallback(curLine);
        if (view[i] == CR && view[i + 1] == LF) {
          i += 1;
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
