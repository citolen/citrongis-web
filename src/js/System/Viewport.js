/*
 * Author citolen
 * Created 26/05/2014
 */

var C = C || {};

C.System = C.System || {};

/////////////////
// Constructor //
/////////////////
C.System.Viewport = function (options) {

    'use strict';

    options = options || {};

    this._width = options.width || 0; // px

    this._height = options.height || 0; // px

    this._resolution = options.resolution || 0; // resolution m/px

    this._schema = options.schema;

    this._origin = options.origin;

    this._rotation = options.rotation || 0;

    this._bbox = new C.Geometry.BoundingBox();

    this._schema.update(this);
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

