/*
**  UI.js
**
**  Author citole_n
**  16/08/2014
*/

var C = C || {};
C.Extension = C.Extension || {};
C.Extension.UI = C.Extension.UI || {};

C.Extension.UI.UI = C.Utils.Inherit(C.Utils.Inherit(function (_context) {
    "use strict";

    this._context = _context;

    this.current = undefined;
}, EventEmitter, 'C.Extension.UI.UI'), C.Extension.UI.Bridge, 'C.Extension.UI.UI');

//////////////////////////
// Display an interface //
//////////////////////////
C.Extension.UI.UI.prototype.display = function (path) {
    "use strict";
    if (!this._context.handle.file(path)) return;

    var template = this._context.handle.file(path).asText();
    this._context.module.global.strings = this._context.module.strings;
    this._context.module.global.include = C.Extension.UI.include.bind(this._context);
    this._context.module.global.trigger = C.Extension.UI.trigger.bind(this._context);
    var result = new EJS({text: template}).render(this._context.module.global);
    var handler = document.createElement('DIV');
    handler.innerHTML = result;
    this.current = handler;
    this.emit('display', handler);
};
