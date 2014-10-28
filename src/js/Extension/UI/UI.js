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

    var context = C.Utils.Context.copy(this._context);
    context.currentPath = path;
    var citrongisCtx = {
        require: C.Extension.Require.bind(context),
        include: C.Extension.UI.include.bind(context)
    };
    var result = new EJS({text: template}).render(this._context.module.global, {}, citrongisCtx);

    var handler = document.createElement('DIV');
    handler.innerHTML = result;
    this.current = handler;
    this.emit('display', handler);
    this._context.module.global.UI.emit('loaded', handler);
};
