/*
**
**  Events.js
**
**  Author citolen
**  11/01/2015
**
*/

var C = C || {};
C.System = C.System || {};

C.System.Events = {

    _isDown: false,
    _lastX: undefined,
    _lastY: undefined

};

C.System.Events.attach = function (citronGIS) {

    'use strict';

    console.log('setup event');

    this._citronGIS = citronGIS;

    $(this._citronGIS._renderer.view).mousedown(C.System.Events.stageDown.bind(this));
    $(window).mouseup(C.System.Events.stageUp.bind(this));
    $(document).mousemove(C.System.Events.stageMove.bind(this));
};

C.System.Events.stageDown = function (evt) {

    'use strict';

    this._isDown = true;
    this._lastX = evt.clientX;
    this._lastY = evt.clientY;
};

C.System.Events.stageUp = function () {

    'use strict';

    this._isDown = false;
};

C.System.Events.stageMove = function (evt) {

    'use strict';

    if (!this._isDown) return;

    var dx = evt.clientX - this._lastX;
    var dy = evt.clientY - this._lastY;

    this._citronGIS._viewport.translate(dx, dy);

    this._lastX = evt.clientX;
    this._lastY = evt.clientY;
};
