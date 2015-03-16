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
    _hasMoved: false,
    _lastX: undefined,
    _lastY: undefined,
    _movedTimer: undefined,
    _movedTimeout: 500
};

C.System.Events.attach = function (citronGIS) {

    'use strict';

    console.log('setup event');

    this._citronGIS = citronGIS;

    $(this._citronGIS._renderer.view).mousedown(C.System.Events.stageDown.bind(this));
    $(window).mouseup(C.System.Events.stageUp.bind(this));
    $(document).mousemove(C.System.Events.stageMove.bind(this));

    this._citronGIS._renderer.view.addEventListener('touchstart', C.System.Events.stageDown.bind(this));
    document.addEventListener('touchmove',C.System.Events.stageMove.bind(this));
    window.addEventListener('touchend', C.System.Events.stageUp.bind(this));

    /*$(this._citronGIS._renderer.view).on('touchstart', C.System.Events.stageDown.bind(this));
    $(window).on('touchmove', C.System.Events.stageUp.bind(this));
    $(document).on('touchend',C.System.Events.stageMove.bind(this));*/

    $(window).keydown(C.System.Events.keyDown.bind(this));
};

C.System.Events.viewportMoveType = {
    ZOOM: 0,
    PAN: 1,
    ROTATION: 2
};

C.System.Events.keyDown = function (evt) {

    'use strict';

    if (evt.keyCode == 106) {
        this.resetTimer();
        this._citronGIS._viewport.rotate(-5);
        this.viewportMove(C.System.Events.viewportMoveType.ROTATION);
    }
    if (evt.keyCode == 111) {
        this.resetTimer();
        this._citronGIS._viewport.rotate(5);
        this.viewportMove(C.System.Events.viewportMoveType.ROTATION);
    }
    if (evt.keyCode == 107) {
        this.resetTimer();
        var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];
        if (zoomLevel !== undefined) {
            this._citronGIS._viewport.zoom(zoomLevel);
            this.viewportMove(C.System.Events.viewportMoveType.ZOOM);
        }
    }
    if (evt.keyCode == 109) {
        this.resetTimer();
        var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1];
        if (zoomLevel !== undefined) {
            this._citronGIS._viewport.zoom(zoomLevel);
            this.viewportMove(C.System.Events.viewportMoveType.ZOOM);
        }
    }
};

C.System.Events.stageDown = function (evt) {

    'use strict';

    this._isDown = true;
    this._hasMoved = false;
    this._lastX = evt.clientX || evt.touches[0].pageX;
    this._lastY = evt.clientY || evt.touches[0].pageY;
};

C.System.Events.stageUp = function () {

    'use strict';

    this._isDown = false;
    if (!this._hasMoved) {
        this.resetTimer();
        var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];
        if (zoomLevel !== undefined) {
            this._citronGIS._viewport.zoom(zoomLevel);
            this.viewportMove(C.System.Events.viewportMoveType.ZOOM);
        }
    }
};

C.System.Events.stageMove = function (evt) {

    'use strict';

    if (!this._isDown) return;

    var x = evt.clientX || evt.touches[0].pageX;
    var y = evt.clientY || evt.touches[0].pageY;

    var dx = x - this._lastX;
    var dy = y - this._lastY;

    if (dx === 0 && dy === 0) return;

    this.resetTimer();

    this._citronGIS._viewport.translate(dx, dy);

    this.viewportMove(C.System.Events.viewportMoveType.PAN);

    this._lastX = x;
    this._lastY = y;
    this._hasMoved = true;
};

C.System.Events.resetTimer = function () {

    'use strict';

    if (this._movedTimer) {
        clearTimeout(this._movedTimer);
    }
    this._movedTimer = setTimeout(this._movedCallback, C.System.Events._movedTimeout);
};

C.System.Events.viewportMove = function (type) {

    'use strict';

    this._citronGIS.emit('viewportMove', this._citronGIS._viewport, type);
    this.internalUpdate();
};

C.System.Events.stageMovedTimeout = function () {

    'use strict';

    this._citronGIS.emit('viewportMoved', this._citronGIS._viewport);
    this.internalUpdate();
};

C.System.Events.internalUpdate = function () {

    'use strict';

    this._citronGIS._customRenderer.updatePositions();
    this._citronGIS._viewport._zoomDirection = C.System.Viewport.zoomDirection.NONE;
};

C.System.Events._movedCallback = C.System.Events.stageMovedTimeout.bind(C.System.Events);
