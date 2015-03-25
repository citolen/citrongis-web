/*
**
**  LayerGroup.js
**
**  Author citolen
**  26/12/2014
**
*/

var C = C || {};
C.Extension = C.Extension || {};

C.Extension.LayerGroup = C.Utils.Inherit(function (base, options) {

    'use strict';

    base();

    if (options === undefined || options.owner === undefined) throw 'Invalid Argument';

    this._name = options.name;

    this._owner = options.owner;

    this._layers = [];

    this._layerDirty = LayerDirty.bind(this);

    this._layerFeatureChange = LayerFeatureChange.bind(this);

}, EventEmitter, 'C.Extension.LayerGroup');

C.Extension.LayerGroup.EventType = {
    ADDED: 0,
    REMOVED: 1,
    MOVED: 2
};

C.Extension.LayerGroup.prototype.layers = function () {

    'use strict';

    var result = [];
    for (var i = 0; i < this._layers.length; ++i) {
        var l = this._layers[i];
        result.push({
            name: l.name(),
            layer: l,
            idx: i
        });
    }
    return (result);
};

C.Extension.LayerGroup.prototype.addLayer = function (layer) {

    'use strict';

    if (layer === undefined || this._layers.indexOf(layer) !== -1) return false;

    layer._owner = this._owner;
    layer._group = this;
    this._layers.push(layer);

    layer.__added();
    layer.on('dirty', this._layerDirty);
    layer.on('featureChange', this._layerFeatureChange);
    this.notifyLayerChange(C.Geo.Layer.EventType.ADDED, layer);
    this.emit('layerAdded', layer);
    return true;
};

C.Extension.LayerGroup.prototype.removeLayer = function (layer) {

    'use strict';

    var idx;
    if (layer === undefined || (idx=this._layers.indexOf(layer)) === -1) return false;

    this._layers.splice(idx, 1);

    layer.__removed();
    layer.off('dirty', this._layerDirty);
    layer.off('featureChange', this._layerFeatureChange);
    this.notifyLayerChange(C.Geo.Layer.EventType.REMOVED, layer);
    this.emit('layerRemoved', layer);
    return true;
};

C.Extension.LayerGroup.prototype.moveLayer = function (layer, toIdx) {

    'use strict';

    var idx;
    if (layer === undefined ||
        (idx=this._layers.indexOf(layer)) === -1 ||
        toIdx === idx ||
        toIdx < 0 ||
        toIdx >= this._layers.length) return false;

    this._layers.splice(idx, 1);
    this._layers.splice(toIdx, 0, layer);
    /* Reorganize rendering */
    this.notifyLayerChange(C.Geo.Layer.EventType.MOVED, layer);
    this.emit('layerMoved', {layer: layer, idx: toIdx});
    return true;
};

/* Forward event to upper level */
function LayerFeatureChange(eventType, feature, layer) {

    'use strict';

    this.emit('featureChange', eventType, feature, layer);
};

C.Extension.LayerGroup.prototype.notifyLayerChange = function (eventType, layer) {

    'use strict';

    this.emit('layerChange', eventType, layer);
};

function LayerDirty(layer) {
    /* Redraw all features */
    this.notifyLayerChange(C.Geo.Layer.EventType.UPDATED, layer);
    layer._dirty = false;
}
