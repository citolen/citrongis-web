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

    this._mask = 0;

    this._type = type;

    this._opacity = 1.0;

    this._events = {};

}, EventEmitter, 'C.Geo.Feature.Feature');

C.Geo.Feature.Feature.OpacityMask = 1024;

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

C.Geo.Feature.Feature.prototype.opacity = function (opacity) {

    if (opacity == undefined || this._opacity == opacity) return (this._opacity);

    this._mask |= C.Geo.Feature.Feature.OpacityMask;
    this._opacity = opacity;
    this.makeDirty();
    return this._opacity;
};

C.Geo.Feature.Feature.prototype.makeDirty = function () {

    'use strict';

    this._dirty = true;
    this.emit('dirty', this);
};

C.Geo.Feature.Feature.prototype.__click = function (evt, data) {

    this.emit('click', evt, data);

};

C.Geo.Feature.Feature.prototype.addEventListener = function (event, fct) {

};
