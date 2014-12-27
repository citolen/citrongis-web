/*
**
**  Layer.js
**
**  Author citole_n
**  24/12/2014
**
*/

var C = C || {};
C.Geo = C.Geo || {};

C.Geo.Layer = C.Utils.Inherit(function (base, options) {

    'use strict';

    if (options === undefined || options.owner === undefined || options.group === undefined) {
        throw 'Invalid Argument';
    }

    base();

    /* Displayed name, if none not displayed */
    this._name = options.name;

    /* Layer enable */
    this._enabled = options.enabled || true;

    /* Index of the layer in the assigned group */
    this._zIndex = options.zIndex || 0;

    /* Displayed opacity, applied to all features */
    this._opacity = options.opacity || 1.0;

    /* Extension owning the layer */
    this._owner = options.owner;

    /* Group in which the layer is */
    this._group = options.group;

    /* All the features */
    this._features = [];

    /* Redraw when dirty */
    this._dirty = false;

    /* Layer's minimum zoom */
    this._minZoom = options.minZoom;

    /* Layer's maximum zoom */
    this._maxZoom = options.maxZoom;

    this._featureDirty = featureDirty.bind(this);

}, EventEmitter, 'C.Geo.Layer');

C.Geo.Layer.prototype.addFeature = function (feature) {

    'use strict';

    if (feature === undefined ||
        feature instanceof C.Geo.Feature.Feature !== true ||
        this._features.indexOf(feature) !== -1) return false;

    this._features.push(feature);
    feature.on('dirty', this._featureDirty);
    this.emit('featureAdded', feature);
    return true;
};

C.Geo.Layer.prototype.removeFeature = function (feature) {

    'use strict';

    var idx;
    if (feature === undefined ||
        feature instanceof C.Geo.Feature.Feature !== true ||
        (idx=this._features.indexOf(feature)) === -1) return false;

    this._features.splice(idx, 1);
    feature.off('dirty', this._featureDirty);
    this.emit('featureRemoved', feature);
    return true;
};

function featureDirty(feature) {
    /* redraw feature */
    feature._dirty = false;
}

/* Change layer's name */
C.Geo.Layer.prototype.name = function (name) {

    'use strict';

    if (name === undefined || this._name === name) return this._name;

    this._name = name;
    this.emit('nameChanged', name);
    return this._name;
};

/* Enable/Disable layer */
C.Geo.Layer.prototype.enabled = function (enabled) {

    'use strict';

    if (enabled == undefined || this._enabled === enabled) return this._enabled;

    this._enabled = enabled;
    this.emit('enabledChanged', enabled);
    return this._enabled;
};

/* Change zIndex of the layer */
C.Geo.Layer.prototype.zIndex = function (zIndex) {

    'use strict';

    if (zIndex === undefined || this._zIndex === zIndex) return this._zIndex;

    this._zIndex = zIndex;
    this.emit('zIndexChanged', zIndex);
    return this._zIndex;
};

/* Change layer's opacity */
C.Geo.Layer.prototype.opacity = function (opacity) {

    'use strict';

    if (opacity === undefined || this._opacity === opacity) return this._opacity;

    this._opacity = opacity;
    this.emit('opacity', opacity);
    this.makeDirty();
    return this._opacity;
};

/* Make the layer dirty */
C.Geo.Layer.prototype.makeDirty = function () {

    'use strict';

    this._dirty = true;
    this.emit('dirty', this);
};
