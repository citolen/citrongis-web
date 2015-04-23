var C = C || {};

C.Utils = C.Utils || {};

/////////////////
// Constructor //
/////////////////
C.Utils.Event = C.Utils.Inherit(function (base, options) {

    'use strict';

    base();

    options = options || {};

}, EventEmitter, 'C.Utils.Event');

C.Utils.Event.prototype.__initialized = function () {

    this.emit('initialized');

};

C.Utils.Event = new C.Utils.Event();
