/*
**
**  Line.js
**
**  Author citolen
**  Created 24/12/2014
**
*/

var C = C || {};
C.Geo = C.Geo || {};
C.Geo.Feature = C.Geo.Feature || {};

C.Geo.Feature.Line = C.Utils.Inherit(function (base, options) {

    'use strict';

    base();

    if (options === undefined || options.locations === undefined) throw 'Invalid Arguments';

    this._locations = options.locations;

    this._lineWidth = options.lineWidth || 1;

    this._lineColor = options.lineColor || '#000000';

}, C.Geo.Feature.Feature, 'C.Geo.Feature.Line');

C.Geo.Feature.Line.prototype.locations = function (locations) {

    'use strict';

    if (locations === undefined || typeof locations !== 'Array') return this._locations;

    this._locations = locations;
    this.emit('locationChanged', locations);
    return this._locations;
};

C.Geo.Feature.Line.prototype.lineWidth = function (lineWidth) {

    'use strict';

    if (lineWidth === undefined || typeof lineWidth !== 'Number' || this._lineWidth === lineWidth) return this._lineWidth;

    this._lineWidth = lineWidth;
    this.emit('lineWidthChanged', lineWidth);
    return this._lineWidth;
};

C.Geo.Feature.Line.prototype.lineColor = function (lineColor) {

    'use strict';

    if (lineColor === undefined || typeof lineColor !== 'Array' || this._lineColor === lineColor) return this._lineColor;

    this._lineColor = lineColor;
    this.emit('lineColorChanged', lineColor);
    return this._lineColor;
};
