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

    this._schema.update(this);
}, EventEmitter, 'C.System.Viewport');

C.System.Viewport.zoomDirection = {
    IN: 0,
    OUT: 1,
    NONE: 2
};

C.System.Viewport.prototype.translate = function (tx, ty) {

    'use strict';

    this._schema.translate(this, tx, ty);
    this._schema.update(this);
};

C.System.Viewport.prototype.rotate = function (angle) {

    'use strict';

    this._schema.rotate(this, angle);
    this._schema.update(this);
};

C.System.Viewport.prototype.zoom = function (resolution) {

    'use strict';

    if (resolution > this._resolution)
        this._zoomDirection = C.System.Viewport.zoomDirection.OUT;
    if (resolution < this._resolution)
        this._zoomDirection = C.System.Viewport.zoomDirection.IN;
    this._resolution = resolution;
    this._schema.update(this);
    this.emit('resolutionUpdate', this);
};

C.System.Viewport.prototype.resize = function (newWidth, newHeight) {

    'use strict';

    this._width = newWidth;
    this._height = newHeight;
    this._schema.update(this);
};

C.System.Viewport.prototype.screenToWorld = function (px, py) {

    'use strict';

    return (this._schema.screenToWorld(this, px, py));
};

C.System.Viewport.prototype.worldToScreen = function (wx, wy) {

    'use strict';

    return (this._schema.worldToScreen(this, wx, wy));
};

