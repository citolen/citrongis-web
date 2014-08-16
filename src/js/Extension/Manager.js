/*
**  Manager.js
**
**  Author citole_n
**  16/08/2014
*/

var C = C || {};
C.Extension = C.Extension || {};

C.Extension.Manager = new (C.Utils.Inherit(function () {

    this.Extensions = [];

}, EventEmitter))();

/*
** Register @extension in the extension manager
*/
C.Extension.Manager.register = function (extension) {
    "use strict";
    if (!extension || !extension.handle || !extension.package || !extension.package.name || this.Extensions[extension.package.name]) return;

    this.Extensions[extension.package.name] = extension;
};

/*
**  Unregister @extension from the extension manager
*/
C.Extension.Manager.unregister = function (extension) {
    "use strict";
    if (!extension || !extension.handle || !extension.package || !extension.package.name || !this.Extensions[extension.package.name]) return;

    this.Extensions.splice(this.Extensions.indexOf(extension.package.name), 1);
};

/*
**  Return the extension with the name @extension_name or undefined/null if not found
*/
C.Extension.Manager.get = function (extension_name) {
    "use strict";
    return (this.Extensions[extension_name]);
};

/*
**
*/
C.Extension.Manager.bridge = function (extension_name, id) {
    "use strict";

    var e = this.get(extension_name);
    if (!e) return;
    e.module.ui.bridge(id);
};
