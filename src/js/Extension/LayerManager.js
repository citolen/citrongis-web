/*
**
**  LayerManager.js
**
**  Author citolen
**  26/12/2014
**
*/

var C = C || {};
C.Extension = C.Extension || {};

C.Extension.LayerManager = C.Utils.Inherit(function (base) {

    'use strict';

    base();

    this._layerGroups = [];

    this._featureChange = FeatureChange.bind(this);

}, EventEmitter, 'C.Extension.LayerManager');

C.Extension.LayerManager.prototype._groups = function () {

    'use strict';

    var result = [];
    for (var i = 0; i < this._layerGroups.length; i++) {
        var g = this._layerGroups[i];
        result.push({
            name: g._name,
            group: g,
            idx: i
        });
    }
    return (result);
};

C.Extension.LayerManager.prototype.groups = function (owner) {

    'use strict';

    if (owner === undefined) throw 'Invalid Arguments';

    var result = [];
    for (var i = 0; i < this._layerGroups.length; ++i) {
        var g = this._layerGroups[i];
        if (g._owner === owner) {
            result.push({
                name: g._name,
                group: g,
                idx: i
            });
        }
    }
    return (result);
};

C.Extension.LayerManager.prototype.createGroup = function (owner, options) {

    'use strict';

    if (owner === undefined) throw 'Invalid Owner';

    options = options || {};
    options.owner = owner;

    var group = new C.Extension.LayerGroup(options);

    group.on('featureChange', this._featureChange);

    this._layerGroups.push(group);
    this.emit('groupCreated', group);
    return (group);
};

C.Extension.LayerManager.prototype.deleteGroup = function (owner, instanceOrName) {

    'use strict';

    if (owner === undefined || instanceOrName === undefined) throw 'Invalid Arguments';

    for (var i = 0; i < this._layerGroups.length; ++i) {
        var g = this._layerGroups[i];
        if (g._owner === owner && (g === instanceOrName || g._name === instanceOrName)) {

            group.off('featureChange', this._featureChange);

            this._layerGroups.splice(i, 1);
            this.emit('groupDeleted', g);
            return (true);
        }
    }
    return (false);
};

C.Extension.LayerManager.prototype.moveGroup = function (owner, instanceOrName, idx) {

    'use strict';

    if (owner === undefined ||
        instanceOrName === undefined ||
        idx < 0 || idx >= this._layerGroups.length) throw 'Invalid Arguments';

    for (var i = 0; i < this._layerGroups.length; ++i) {
        var g = this._layerGroups[i];
        if (g._owner === owner && (g === instanceOrName || g._name === instanceOrName)) {
            if (i === idx) return (false);
            this._layerGroups.splice(i, 1);
            this._layerGroups.splice(idx, 0, g);
            this.emit('groupMoved', {group: g, idx: idx});
            return (true);
        }
    }
    return (false);
};

function FeatureChange(eventType, feature) {

    'use strict';

    this.emit('featureChange', eventType, feature);
};
