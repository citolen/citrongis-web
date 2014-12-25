/*
**
**  Circle.js
**
**  Author citolen
**  Created 24/12/2014
**
*/

var C = C || {};
C.Geo = C.Geo || {};
C.Geo.Feature = C.Geo.Feature || {};

C.Geo.Feature.Circle = C.Utils.Inherit(function (options) {

    'use strict';

    if (options === undefined || options.location == undefined) throw 'Invalid Argument';

    this._location = options.location;

    this._radius = options.radius || {val:1,format:'px'};

    this._backgroundColor = options.backgroundColor || '#000000';

    this._outlineColor = options.outlineColor || '#ffffff';

    this._outlineWidth = options.outlineWidth || 0;

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Circle');

C.Geo.Feature.Circle.prototype.location = function (location) {

    'use strict';

    if (location === undefined || location instanceof C.Geometry.Point === false || this._location === location) return this._location;

    this._location = location;
    this.emit('locationChanged', location);
    this.makeDirty();
};

C.Geo.Feature.Circle.prototype.radius = function (radius) {

    'use strict';

    if (radius === undefined || (typeof radius !== 'Number' && typeof radius !== 'Object') || this._radius == radius) return this._radius;

    this._radius = radius;
    this.emit('radiusChanged', radius);
    this.makeDirty();
};

C.Geo.Feature.Circle.prototype.backgroundColor = function (backgroundColor) {

    'use strict';

    if (backgroundColor === undefined || this._backgroundColor == backgroundColor) return this._backgroundColor;

    this._backgroundColor = backgroundColor;
    this.emit('backgroundColorChanged', backgroundColor);
    this.makeDirty();
};

C.Geo.Feature.Circle.prototype.outlineColor = function (outlineColor) {

    'use strict';

    if (outlineColor === undefined || this._outlineColor == outlineColor) return this._outlineColor;

    this._outlineColor = outlineColor;
    this.emit('outlineColorChanged', outlineColor);
    this.makeDirty();
};

C.Geo.Feature.Circle.prototype.outlineWidth = function (outlineWidth) {

    'use strict';

    if (outlineWidth === undefined || this._outlineWidth == outlineWidth) return this._outlineWidth;

    this._outlineWidth = outlineWidth;
    this.emit('outlineWidthChanged', outlineWidth);
    this.makeDirty();
};
