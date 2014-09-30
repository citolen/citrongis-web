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
    var fileExt = filepath.lastIndexOf('.');
    if (fileExt == -1 || fileExt == filepath.length)
        fileExt = "js";
    else {
        fileExt = filepath.substr(fileExt + 1);
    }
    if (fileExt == "js") {
        var code = this.handle.file(filepath).asText();
        eval('(function(require) {'
             + code +
            '}).call(this.module.global, this.module.global.require)');
    }
    if (fileExt == "css") {
        var s = document.createElement("style");
        s.innerHTML = this.handle.file(filepath).asText();
        document.getElementsByTagName("head")[0].appendChild(s);
    }
};
