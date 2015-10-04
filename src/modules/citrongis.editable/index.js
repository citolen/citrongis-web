/*
 *  citrongis.editable.js   - handle manipulation of features
 */

var map = E.map;
var layer = C.Layer();

layer.addTo(map);

var Pivot = C.Utils.Inherit(function (base, location, idx) {

    base();

    var self = this;

    this._pivot = C.Circle({
        radius: 7,
        location: location,
        outlineColor: 0xF2676B,
        backgroundColor: 0xffffff,
        outlineWidth: 3
    });

    this._pivot.addTo(layer);

    this._isMoving = false;

    self._idx = idx;

    this._pivot.on('mousedown', function (f, evt) {
        evt.stopPropagation();
        evt.data.originalEvent.preventDefault();
        evt.data.originalEvent.stopPropagation();
        self._isMoving = true;
    });

    this._pivot.on('mousemove', function (f, evt) {
        if (!self._isMoving) { return; }
        var w = C.Viewport.screenToWorld(evt.data.global.x, evt.data.global.y);
        var new_location = C.Point(w.X, w.Y, 0, C.Schema._crs);
        self._pivot.location(new_location);
        self.emit('change', new_location, self._idx);
    });

    this._pivot.on('mouseup', function () {
        self._isMoving = false;
    });


}, EventEmitter);

Pivot.prototype.clear = function () {
    layer.removeFeature(this._pivot);
};

var EditableFeature = C.Utils.Inherit(function (base, feature) {

    base();

    this._isEditing = false;

    this._feature = feature;

    this._pivots = [];

}, EventEmitter);

EditableFeature.prototype.edit = function () {

    if (this._isEditing) { return; }

    this._isEditing = true;

    switch(this._feature._type) {
        case C.FeatureType.CIRCLE:
            this._editCircle();
            break;
        case C.FeatureType.LINE:
            this._editLine();
            break;
        case C.FeatureType.POLYGON:
            this._editPolygon();
            break;
        case C.FeatureType.IMAGE:
            this._editImage();
            break;
    }
};

EditableFeature.prototype._editCircle = function () {
    var self = this;
    this._pivots = [];
    var location = this._feature.location();
    var pivot = new Pivot(location);
    pivot.on('change', function (newLocation) {
        self._feature.location(newLocation);
        self.emit('edited', self);
    });
    this._pivots.push(pivot);
};

EditableFeature.prototype._editLine = function () {
    var self = this;
    this._pivots = [];
    var locations = this._feature.locations();
    for (var i = 0; i < locations.length; ++i) {
        var pivot = new Pivot(locations[i], i);
        pivot.on('change', function (newLocation, idx) {
            self._feature.locationAt(idx, newLocation);
            self.emit('edited', self);
        });
        this._pivots.push(pivot);
    }
};

EditableFeature.prototype._editPolygon = function () {
    var self = this;
    this._pivots = [];
    var locations = this._feature.locations();
    for (var i = 0; i < locations.length; ++i) {
        var pivot = new Pivot(locations[i], i);
        pivot.on('change', function (newLocation, idx) {
            self._feature.locationAt(idx, newLocation);
            self.emit('edited', self);
        });
        this._pivots.push(pivot);
    }
};

EditableFeature.prototype._editImage = function () {
    var self = this;
    this._pivots = [];
    var location = this._feature.location();
    var pivot = new Pivot(location);
    pivot.on('change', function (newLocation) {
        self._feature.location(newLocation);
        self.emit('edited', self);
    });
    this._pivots.push(pivot);
};

EditableFeature.prototype.done = function () {
    if (!this._isEditing) { return; }
    for (var i = 0; i < this._pivots.length; ++i) {
        this._pivots[i].clear();
    }
    this._pivots = [];
    this._isEditing = false;
};

function moveLayerToTop() {
    map.moveLayer(layer, map.count() - 1);
}

module.exports = {
    EditableFeature: EditableFeature
};
