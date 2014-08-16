/*
**  Extension.js
**
**  Author citole_n
**  16/08/2014
*/

var C = C || {};
C.Extension = C.Extension || {};

C.Extension.AR_STRINGS_LOCALIZATION = 'strings.json';
C.Extension.AR_PACKAGE = 'package.json';

//
C.Extension.Extension = function (handle) {
    "use strict";

    if (!handle || !handle.file(C.Extension.AR_PACKAGE)) return (null);
    this.handle = handle;

    this.module = new C.Extension.Module(this,
                                         this.handle.file(C.Extension.AR_STRINGS_LOCALIZATION) ?
                                            JSON.parse(this.handle.file(C.Extension.AR_STRINGS_LOCALIZATION).asText()) : {});

    this.package = JSON.parse(this.handle.file(C.Extension.AR_PACKAGE).asText());
};

// start an extension
C.Extension.Extension.prototype.run = function () {
    var startScript = this.package.main || 'src/main.js';
    if (!this.handle.file(startScript)) return (false);

    var code = this.handle.file(startScript).asText();
    eval('console.log(this); (function (module) {\
            ' + code + '\
            }).call(this.module.global, this.module);');
};
