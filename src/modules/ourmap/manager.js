/*
 *  manager.js  Manage clients
 */

'use strict';

var self = this;

var Manager = C.Utils.Inherit(function (base, options) {
    base();
    options = options || {};

    this._layer = options.layer;
    this._clientOverlayLayer = options.clientOverlay;
    this._clientOverlayEnabled = true;

    this._idgen = 0;
    this._features = {};

    this._clients = {};

    this.featureEdit = this._featureEdit.bind(this);
    this.featureEditDone = this._featureEditDone.bind(this);
}, EventEmitter);

Manager.prototype.disconnect = function () {
    for (var id in this._clients) {
        this.unregisterClient(id);
    }
    this._layer.clearLayer();
    this._features = {};
    this._clients = {};
};

Manager.prototype._featureEditDone = function (f) {
    this.emit('featureEditDone', f);
};

Manager.prototype._featureEdit = function (f) {
    this.emit('featureEdit', f);
};

Manager.prototype._addFeature = function (feature) {
    this._features[feature._id] = feature;
    this._layer.add(feature._feature._feature);
    feature.on('edit', this.featureEdit);
    feature.on('done', this.featureEditDone);
};

Manager.prototype.addFeature = function (feature) {
    this._addFeature(feature);
    self.client._socket.emit('featureadded', {
        temp_id: feature._id,
        data: feature.getData()
    });
};

Manager.prototype.removeFeature = function (id) {
    var feature = this._features[id];
    if (!feature) { return; }
    feature._feature.done();
    delete this._features[id];
    self.client._socket.emit('featuredeleted', {
        id: id
    });
    this._layer.remove(feature._feature._feature);
};

Manager.prototype.updateFeature = function (id) {
    var feature = this._features[id];
    if (!feature) { return; }

    self.client._socket.emit('featureupdated', {
        id: id,
        data: feature.getData()
    });
};

Manager.prototype.sendViewport = function () {
    if (!self.client) { return; }

    var bounds = C.Viewport.getBounds();

    self.client._socket.emit('viewportupdated', {
        bottomLeft:     [bounds._bottomLeft.X,  bounds._bottomLeft.Y],
        topLeft:        [bounds._bottomLeft.X,  bounds._topRight.Y],
        topRight:       [bounds._topRight.X,    bounds._topRight.Y],
        bottomRight:    [bounds._topRight.X, bounds._bottomLeft.Y],
        crs: C.ProjectionsHelper.getProjectionName(bounds._crs)
    });
};

Manager.prototype.registerClient = function (client) {

    if (client._id in this._clients) { return false; }

    this._clients[client._id] = client;

    this.displayClientViewport(client);

    this.uiAddClient(client);
};

Manager.prototype.unregisterClient = function (id) {

    var client = this.getClientById(id);
    if (!client) { return; }

    delete this._clients[id];

    this._clientOverlayLayer.remove(client._viewportFeature);
    this._clientOverlayLayer.remove(client._viewportText);

    this.uiRemoveClient(id);
};

Manager.prototype.uiAddClient = function (client) {
    var item = document.createElement('div');
    var content = document.createElement('div');
    var user = document.createElement('a');

    item.className = 'item';
    item.id = client._id;
    content.className = 'content';
    user.className = 'header';

    user.innerHTML = client._id;

    $(user).click(function (client) {

        var viewport = client._viewport;
        var crs = C.ProjectionsHelper.getProjectionFromName(viewport.crs);
        var bounds = C.Bounds(C.Vector2(viewport.bottomLeft[0], viewport.bottomLeft[1]),
                              C.Vector2(viewport.topRight[0], viewport.topRight[1]),
                              crs);

        C.Events.zoomToBounds(bounds);

    }.bind(null, client));

    content.appendChild(user);
    item.appendChild(content);
    E.$('#client_list').append(item);
};

Manager.prototype.uiRemoveClient = function (id) {
    E.$('#'+id).remove();
};

Manager.prototype.getClientById = function (id) {
    if (id in this._clients) {
        return this._clients[id];
    }
    return undefined;
};

Manager.prototype.displayClientViewport = function (client) {

    var viewport = client._viewport;
    if (!viewport) { return; }

    var crs = C.ProjectionsHelper.getProjectionFromName(viewport.crs);
    var locations = [
        C.Point(viewport.bottomLeft[0], viewport.bottomLeft[1], 0, crs),
        C.Point(viewport.topLeft[0], viewport.topLeft[1], 0, crs),
        C.Point(viewport.topRight[0], viewport.topRight[1], 0, crs),
        C.Point(viewport.bottomRight[0], viewport.bottomRight[1], 0, crs),
    ];

    if (!client._viewportFeature) {
        client._viewportFeature = C.Polygon({
            locations: locations,
            color: 0x4E7BA0,
            outlineWidth: 1,
            outlineColor: 0xffffff,
            opacity: 0.3
        });
        client._viewportText = C.Text({
            location: locations[1],
            text: client._id,
            fill: 0x000000,
            font: 'Arial 14px',
            offset: C.Vector2(0, -14)
        });
        this._clientOverlayLayer.add(client._viewportFeature);
        this._clientOverlayLayer.add(client._viewportText);
    } else {
        client._viewportText.location(locations[1]);
        client._viewportFeature.locations(locations);
    }
};

Manager.prototype.genId = function () {
    return this._idgen++;
}

function ctr(args) {
    return Manager.apply(this, args);
}
ctr.prototype = Manager.prototype;
module.exports = function () {
    return new ctr(arguments);
};
