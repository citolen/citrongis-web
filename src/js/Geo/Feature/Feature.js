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

C.Geo.Feature.Feature = C.Utils.Inherit(function (base) {

    'use strict';

    base();

    this._dirty = false;

}, EventEmitter, 'C.Geo.Feature.Feature');

C.Geo.Feature.Feature.prototype.makeDirty = function () {

    'use strict';

    this._dirty = true;
    this.emit('dirty', this);
};
