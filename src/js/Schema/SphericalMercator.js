/*
**
**  SphericalMercator.js
**
**  Author citolen
**  11/01/2015
**
*/

var C = C || {};
C.Schema = C.Schema || {};

C.Schema.SphericalMercator = C.Utils.Inherit(function (base) {

    'use strict';

    base({
        name: 'SphericalMercator',
        src: 'epsg:3857',
        originX: -20037508.342789,
        originY: -20037508.342789,
        extent: new C.Geometry.Extent(-20037508.342789,
                                      -20037508.342789,
                                      20037508.342789,
                                      20037508.342789)
    });

}, C.Schema.SchemaBase, 'C.Schema.SphericalMercator');

C.Schema.SphericalMercator.prototype.translate = function (viewport, tx, ty) {

    'use strict';

    var mx = viewport._resolution * tx; // m/px * px -> m
    var my = viewport._resolution * ty; // m/px * px -> m, inverted Y

    viewport._origin.X += mx;
    viewport._origin.Y += my;
};

C.Schema.SphericalMercator.prototype.rotate = function (viewport, angle) {

    'use strict';

    viewport._rotation = (viewport._rotation + angle + 360) % 360;
};

C.Schema.SphericalMercator.prototype.update = function (viewport) {

    'use strict';

    // combine origin, screen size, resolution

    var halfScreenMX = (viewport._resolution * viewport._width) / 2; // screen width in m
    var halfScreenMY = (viewport._resolution * viewport._height) / 2; // screen height in m;

    //TODO: use rotation

    viewport._bbox._bottomLeft.X = viewport._origin.X - halfScreenMX;
    viewport._bbox._bottomLeft.Y = viewport._origin.Y - halfScreenMY;

    viewport._bbox._topLeft.X = viewport._origin.X - halfScreenMX;
    viewport._bbox._topLeft.Y = viewport._origin.Y + halfScreenMY;

    viewport._bbox._topRight.X = viewport._origin.X + halfScreenMX;
    viewport._bbox._topRight.Y = viewport._origin.Y + halfScreenMY;

    viewport._bbox._bottomRight.X = viewport._origin.X + halfScreenMX;
    viewport._bbox._bottomRight.Y = viewport._origin.Y - halfScreenMY;
};

C.Schema.SphericalMercator.prototype.screenToWorld = function (viewport, px, py) {

    'use strict';

    //TODO: use rotation
    var dx = viewport._width / 2 - px;
    var dy = viewport._height / 2 - px;
    dx *= viewport._resolution; // to meter
    dy *= viewport._resolution; // to meter;
    dx += viewport._origin.X; // replace relative to origin
    dy += viewport._origin.Y; // replace relative to origin
    return (new C.Geometry.Vector2(dx, dy));
};

C.Schema.SphericalMercator.prototype.worldToScreen = function (viewport, wx, wy) {

    'use strict';

    //TODO: use rotation
    var dx = wx - viewport._origin.X;
    var dy = wy - viewport._origin.Y;
    dx /= viewport._resolution; // to pixel
    dy /= viewport._resolution;
    dx += viewport._width / 2;
    dy += viewport._height / 2;
    return (new C.Geometry.Vector2(dx, dy));
};
