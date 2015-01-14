/*
**
**  Feature.js
**
**  Author citolen
**  Created 24/12/2014
**
*/

var C = C || {};
C.Geo = C.Geo || {};
C.Geo.Feature = C.Geo.Feature || {};

C.Geo.Feature.Feature = C.Utils.Inherit(function (base, type) {

    'use strict';

    base();

    this._dirty = false;

    this._type = type;

}, EventEmitter, 'C.Geo.Feature.Feature');

C.Geo.Feature.Feature.EventType = {
    ADDED: 0,
    REMOVED: 1,
    UPDATED: 2
};

C.Geo.Feature.Feature.FeatureType = {
    CIRCLE: 0,
    IMAGE: 1,
    LINE: 2,
    POLYGON: 3
};

C.Geo.Feature.Feature.prototype.makeDirty = function () {

    'use strict';

    this._dirty = true;
    this.emit('dirty', this);
};
