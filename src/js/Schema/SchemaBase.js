/*
**
**  SchemaBase.js
**
**  Author citolen
**  30/12/2014
**
*/

var C = C || {};
C.Schema = C.Schema || {};

C.Schema.SchemaBase = function (options) {

    'use strict';

    options = options || {};

    this._name = options.name;

    this._srs = options.srs; // Like Espg

    this._originX = options.originX;

    this._originY = options.originY; //

    this._extent = options.extent; // BoundingBox
};

C.Schema.SchemaBase.prototype.translate = function (viewport, tx, ty) {

    'use strict';

    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.rotate = function (viewport, angle) {

    'use strict';

    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.update = function (viewport) {

    'use strict';

    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.screenToWorld = function (viewport, px, py) {

    'use strict';

    throw 'To Implement';
};

C.Schema.SchemaBase.prototype.worldToScreen = function (viewport, wx, wy) {

    'use strict';

    throw 'To Implement';
};
