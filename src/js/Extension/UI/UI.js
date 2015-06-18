/*
**  UI.js
**
**  Author citole_n
**  16/08/2014
*/

var C = C || {};
C.Extension = C.Extension || {};
C.Extension.UI = C.Extension.UI || {};

C.Extension.UI.UI = C.Utils.Inherit(C.Utils.Inherit(function (base, base1, _context) {
    "use strict";

    base();
    base1();

    this._context = _context;

    this.current = undefined;
}, EventEmitter, 'C.Extension.UI.UI'), C.Extension.UI.Bridge, 'C.Extension.UI.UI');

//////////////////////////
// Display an interface //
//////////////////////////
C.Extension.UI.UI.prototype.display = function (path) {
    "use strict";
    var page = C.Extension.Require.call(this._context, path);
    if (!page) return;

    var context = C.Utils.Context.copy(this._context);
    context.currentPath = path;
    var citrongisCtx = {
        require: C.Extension.Require.bind(context),
        include: C.Extension.UI.include.bind(context)
    };
    var result = new EJS({text: page}).render(this._context.module.global, {}, citrongisCtx);

    var handler = $.parseHTML(result)[1];
    handler.classList.add('citrongisextension-handler');
    this.current = handler;
    this.emit('display', handler);
    if (this._context.module.global.onLoaded !== undefined && typeof this._context.module.global.onLoaded === 'function') {
        this._context.module.global.onLoaded(handler);
    }
};
