/*
**
**  Polygon.js
**
**  Author citolen
**  Created 24/12/2014
**
*/

var C = C || {};
C.Geo = C.Geo || {};
C.Geo.Feature = C.Geo.Feature || {};

C.Geo.Feature.Polygon = C.Utils.Inherit(function (base, options) {

    'use strict';

    base(C.Geo.Feature.Feature.FeatureType.POLYGON);

    if (options === undefined || options.locations === undefined) throw 'Invalid Arguments';

    this._locations = options.locations;

    this._fillColor = options.fillColor || 0xffffff;

    this._outlineColor = options.outlineColor || 0;

    this._outlineWidth = options.outlineWidth || 0;

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Polygon');

C.Geo.Feature.Polygon.prototype.locations = function (locations) {

    'use strict';

    if (locations == undefined || this._locations === locations) return this._locations;

    this._locations = locations;
    this._mask |= C.Geo.Feature.Polygon.MaskIndex.LOCATION;
    this.emit('locationsChanged', locations);
    this.makeDirty();
    return this._locations;
};

C.Geo.Feature.Polygon.prototype.fillColor = function (fillColor) {

    'use strict';

    if (fillColor == undefined || this._fillColor === fillColor) return this._fillColor;

    this._fillColor = fillColor;
    this.emit('fillColorChanged', fillColor);
    this.makeDirty();
    return this._fillColor;
};

C.Geo.Feature.Polygon.prototype.outlineColor = function (outlineColor) {

    'use strict';

    if (outlineColor == undefined || this._outlineColor === outlineColor) return this._outlineColor;

    this._outlineColor = outlineColor;
    this.emit('outlineColorChanged', outlineColor);
    this.makeDirty();
    return this._outlineColor;
};

C.Geo.Feature.Polygon.prototype.outlineWidth = function (outlineWidth) {

    'use strict';

    if (outlineWidth == undefined || this._outlineWidth === outlineWidth) return this._outlineWidth;

    this._outlineWidth = outlineWidth;
    this.emit('outlineWidthChanged', outlineWidth);
    this.makeDirty();
    return this._outlineWidth;
};
