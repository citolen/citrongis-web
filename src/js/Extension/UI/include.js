/*
**  include.js
**
**  Author citole_n
**  15/08/2014
*/

var C = C || {};
C.Extension = C.Extension || {};
C.Extension.UI = C.Extension.UI || {};

C.Extension.UI.include = function (filepath) {
    if (!this.handle.file(filepath)) return;
    var code = this.handle.file(filepath).asText();
    eval('(function(require) {'
         + code +
        '}).call(this.module.global, this.module.global.require)');
};
