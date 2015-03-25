/*
 * Author citolen
 * Created 26/05/2014
 */

var C = C || {};

C.System = C.System || {};

/////////////////
// Constructor //
/////////////////
C.System.Viewport = C.Utils.Inherit(function (base, options) {

    'use strict';

    base();

    options = options || {};

    this._width = options.width || 0; // px

    this._height = options.height || 0; // px

    this._resolution = options.resolution || 0; // resolution m/px

    this._schema = options.schema;

    this._origin = options.origin;

    this._rotation = options.rotation || 0;

    this._bbox = new C.Geometry.BoundingBox();

    this._zoomDirection = C.System.Viewport.zoomDirection.NONE;

    this._movedTimer;

    this._movedCallback = this._eventMoved.bind(this);

    this._mask = 0;

    this._update();
}, EventEmitter, 'C.System.Viewport');

C.System.Viewport.zoomDirection = {
    IN: 0,
    OUT: 1,
    NONE: 2
};

C.System.Viewport.ActionMask = {
    TRANSLATE: 1,
    ROTATE: 2,
    ZOOM: 4,
    RESIZE: 8
};

C.System.Viewport.prototype.translate = function (tx, ty, noEvent) {

    'use strict';

    this._schema.translate(this, tx, ty);
    this._mask |= C.System.Viewport.ActionMask.TRANSLATE;
    this._update(noEvent);
};

C.System.Viewport.prototype.rotate = function (angle, noEvent) {

    'use strict';

    this._schema.rotate(this, angle);
    this._mask |= C.System.Viewport.ActionMask.ROTATE;
    this._update(noEvent);
};

C.System.Viewport.prototype.zoom = function (resolution, noEvent) {

    'use strict';

    if (resolution > this._resolution)
        this._zoomDirection = C.System.Viewport.zoomDirection.OUT;
    if (resolution < this._resolution)
        this._zoomDirection = C.System.Viewport.zoomDirection.IN;
    this._resolution = resolution;
    this._mask |= C.System.Viewport.ActionMask.ZOOM;
    this._update(noEvent);
    this.emit('resolutionUpdate', this);
};

C.System.Viewport.prototype.resize = function (newWidth, newHeight, noEvent) {

    'use strict';

    this._width = newWidth;
    this._height = newHeight;
    this._mask |= C.System.Viewport.ActionMask.RESIZE;
    this._update(noEvent);
};

C.System.Viewport.prototype._update = function (noEvent) {

    'use strict';

    this._schema.update(this);
    if (!noEvent)
        this._eventMove();
};

C.System.Viewport.prototype._eventMove = function () {

    'use strict';

    if (this._movedTimer) {
        clearTimeout(this._movedTimer);
    }
    this._movedTimer = setTimeout(this._movedCallback, C.System.Events._movedTimeout);
    this.emit('move', this);
    this._mask = 0;
};

C.System.Viewport.prototype._eventMoved = function () {

    'use strict';

    this.emit('moved', this);
};

C.System.Viewport.prototype.screenToWorld = function (px, py) {

    'use strict';

    return (this._schema.screenToWorld(this, px, py));
};

C.System.Viewport.prototype.worldToScreen = function (wx, wy) {

    'use strict';

    return (this._schema.worldToScreen(this, wx, wy));
};

