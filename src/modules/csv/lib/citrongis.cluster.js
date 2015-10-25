/*
 *  citrongis.cluster.js    //TODO add description
 */

'use strict';

var Cluster = C.Utils.Inherit(function (base, options) {

    options = options || {};
    base(options);

    this._nonClusteringFeature =    [];
    this._clusteringFeature =       [];

    this._clusterGrids =            {};
    this._unclusterGrids =          {};
    this._maxZoom =                 options.maxZoom;
    this._topCluster =              new ClusterNode({
        zoom: -1,
        type: ClusterNodeType.CLUSTER
    });
    this._refreshCallback = this._refresh.bind(this);
    this._initialize();

}, C.Layer_class);

Cluster.prototype._initialize = function () {
    if (!this._maxZoom) {
        this._maxZoom = C.Viewport.getMaxZoomLevel();
    }
    for (var i = 0; i <= this._maxZoom; ++i) {
        if (i == this._maxZoom) {
            this._clusterGrids[i] = new ClusterGrid(5 * C.Viewport.getResolutionAtZoomLevel(i));
            this._unclusterGrids[i] = new ClusterGrid(5 * C.Viewport.getResolutionAtZoomLevel(i));
        } else {
            this._clusterGrids[i] = new ClusterGrid(150 * C.Viewport.getResolutionAtZoomLevel(i));
            this._unclusterGrids[i] = new ClusterGrid(150 * C.Viewport.getResolutionAtZoomLevel(i));
        }
    }
};

Cluster.prototype.__added = function () {
    C.Events.on('zoomend', this._refreshCallback);
    C.Layer_class.prototype.__added.apply(this, arguments);
    this._refresh();
};

Cluster.prototype.__removed = function () {
    C.Events.off('zoomend', this._refreshCallback);
    C.Layer_class.prototype.__removed.apply(this, arguments);
};

Cluster.prototype.add = function (feature) {
    if (!feature) { //check instanceof C.Geo.Feature.Feature
        return;
    }
    if (feature.constructor == Array) {
        var features = feature;
        for (var i = 0; i < features.length;++i) {
            this._add(features[i]);
        }
        this.refreshAll();
    } else {
        this._add(feature, true);
    }
};

Cluster.prototype.refreshAll = function () {
    this._refresh();
};

Cluster.prototype.remove = function (feature) {
    if (!feature) { return; }
    if (feature.constructor == Array) {
        var features = feature;
        for (var i = 0; i < features.length;++i) {
            this._remove(features[i]);
        }
    } else {
        this._remove(feature);
    }
    this.refreshAll();
};

Cluster.prototype._remove = function (feature) {
    switch (feature._type) {
        case C.FeatureType.CIRCLE:
        case C.FeatureType.IMAGE:
        case C.FeatureType.TEXT:
            var idx = this._clusteringFeature.indexOf(feature);
            if (idx !== -1) {
                this._clusteringFeature.splice(idx, 1);
                this._removeObjectFromCluster(feature);
            }
            break;
        default:
            var idx = this._nonClusteringFeature.indexOf(feature);
            if (idx !== -1) {
                this._nonClusteringFeature.splice(idx, 1);
                C.Layer_class.prototype.remove.call(this, feature);
            }
            break;
    }
};

Cluster.prototype._add = function (feature, refresh) {
    switch (feature._type) {
        case C.FeatureType.CIRCLE:
        case C.FeatureType.IMAGE:
        case C.FeatureType.TEXT:
            this._clusteringFeature.push(feature);
            this._addObjectToCluster(feature, refresh);
            break;
        default:
            this._nonClusteringFeature.push(feature);
            C.Layer_class.prototype.add.call(this, feature);
            break;
    }
};

Cluster.prototype._refresh = function () {
    this.clearLayer();

    var zoom = C.Viewport.getZoomLevel();

    C.Layer_class.prototype.add.call(this, this._clusterGrids[zoom]._layer);
    C.Layer_class.prototype.add.call(this, this._unclusterGrids[zoom]._layer);

    var clustered = this._clusterGrids[zoom]._objects;
    for (var i = 0; i < clustered.length; ++i) {
        var cluster = clustered[i];
        cluster._feature.refresh();
    }
};

Cluster.prototype._removeObjectFromCluster = function (feature) {

    var cluster;

    for (var zoom = this._maxZoom; zoom >= 0; --zoom) {
        var node = this._unclusterGrids[zoom].removeFeature(feature);
        if (!cluster) { cluster = node; }
    }

    if (!cluster) {
        var bottomGrid = this._clusterGrids[this._maxZoom];
        for (var i = 0; i < bottomGrid._objects.length; ++i) {
            var node = bottomGrid._objects[i];
            for (var j = 0; j < node._children.length; ++j) {
                if (node._children[j]._feature == feature) {
                    cluster = node;
                    cluster.removeChild(node._children[j]);
                    break;
                }
            }
            if (cluster) { break; }
        }
        if (!cluster) { return; }
    } else {
        var removedNode = cluster;
        cluster = cluster._parent;
        cluster.removeChild(removedNode);
    }

    while (cluster._zoom >= 0 && cluster.count() <= 1) {
        var leftChild = cluster._children[0];
        cluster.removeChild(leftChild);
        this._clusterGrids[cluster._zoom].removeNode(cluster);

        if (leftChild) {
            if (leftChild._type != ClusterNodeType.CLUSTER) {
                this._unclusterGrids[cluster._zoom].addNode(leftChild);
                cluster._parent.addChild(leftChild);
            }
        }
        var parent = cluster._parent;
        cluster._parent.removeChild(cluster);
        cluster = parent;
    }
};

Cluster.prototype._addObjectToCluster = function (feature, refresh) {

    var featureLocation = C.CoordinatesHelper.TransformTo(feature.location(), C.Schema._crs);

    var node = new ClusterNode({
        feature: feature,
        type: ClusterNodeType.FEATURE,
        location: featureLocation,
        zoom: this._maxZoom
    });

    for (var zoom = this._maxZoom; zoom >= 0; --zoom) {

        var closestCluster = this._clusterGrids[zoom].getNearNode(featureLocation);
        if (closestCluster) {
            closestCluster.addChild(node, refresh);
            return;
        }

        var closestNode = this._unclusterGrids[zoom].getNearNode(featureLocation);
        if (closestNode) {

            for (var z = zoom; z >= 0; --z) {
                this._unclusterGrids[z].removeNode(closestNode);
            }

            var parent = closestNode._parent;
            if (parent) {
                parent.removeChild(closestNode);
            }

            var clusterGroup = new ClusterGroup();
            var clusterNode = new ClusterNode({
                feature: clusterGroup,
                type: ClusterNodeType.CLUSTER,
                zoom: zoom
            });
            clusterGroup._node = clusterNode;
            clusterNode.addChild(closestNode, refresh);
            clusterNode.addChild(node, refresh);
            this._clusterGrids[zoom].addNode(clusterNode);


            var lastParent = clusterNode;
            for (var z = zoom - 1; z > parent._zoom; --z) {
                var clusterGroup = new ClusterGroup();
                var clusterNode = new ClusterNode({
                    feature: clusterGroup,
                    type: ClusterNodeType.CLUSTER,
                    zoom: z
                });
                clusterGroup._node = clusterNode;
                clusterNode.addChild(lastParent, refresh);
                this._clusterGrids[z].addNode(clusterNode);
                lastParent = clusterNode;
            }
            parent.addChild(lastParent, refresh);
            return;
        }

        this._unclusterGrids[zoom].addNode(node);
    }
    this._topCluster.addChild(node);
};

Cluster.prototype.addFeature = Cluster.prototype.addFeature = Cluster.prototype.add;

/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/


var ClusterNodeType = {
    FEATURE: 0,
    CLUSTER: 1
};

var ClusterNode = function (options) {

    options = options || {};

    this._type = options.type || ClusterNodeType.FEATURE;

    this._children = [];

    this._feature = options.feature;

    this._parent = options.parent;

    this._location = options.location;

    this._zoom = options.zoom;

    this._needRefresh = false;
};

ClusterNode.prototype = {

    count: function () {
        var count = 0;
        for (var i = 0; i < this._children.length; ++i) {
            var child = this._children[i];
            if (child._type == ClusterNodeType.CLUSTER) {
                count += child.count();
            } else {
                ++count;
            }
        }
        return count;
    },

    location: function () {
        if (this._type == ClusterNodeType.FEATURE) {
            return this._location;
        }
        var bounds = C.Bounds();
        for (var i = 0; i < this._children.length; ++i) {
            var child = this._children[i];
            bounds.extend(child.location());
        }
        return bounds.getCenter();
    },

    removeChild: function (node) {
        for (var i = 0; i < this._children.length; ++i) {
            var child = this._children[i];
            if (child == node) {
                child._parent = undefined;
                return this._children.splice(i, 1);
            }
        }
    },

    addChild: function (node, refresh) {
        this._children.push(node);
        node._parent = this;
        if (refresh && this._feature) {
            this._feature.refresh();
            var parent = this._parent;
            while (parent) {
                if (parent._feature) {
                    parent._feature.refresh();
                }
                parent = parent._parent;
            }
        }
    }

};

var ClusterGroup = C.Utils.Inherit(function (base, options) {

    options = options || {};
    base(options);

    this._node;

    this._icon = C.Circle({
        location: C.LatLng(0,0),
        color: 0xe67e22,
        outlineColor: 0xf39c12,
        outlineWidth: 4,
        radius: 22,
        opacity: 1
    });

    //    this._icon = C.Circle({
    //        location: C.LatLng(0,0),
    //        color: 0x27ae60,
    //        outlineColor: 0x2ecc71,
    //        outlineWidth: 4,
    //        radius: 22,
    //        opacity: 1
    //    });

    this._label = C.Text({
        location: C.LatLng(0,0),
        text: '0',
        font: '15px Arial',
        anchor: [0.5, 0.5],
        fill: 0xFFFFFF
    });

    C.Layer_class.prototype.add.call(this, this._icon);
    C.Layer_class.prototype.add.call(this, this._label);

    this._onclick = this.onclick.bind(this);


}, C.FeatureGroup_class);

ClusterGroup.prototype.__added = function () {
    this._icon.on('click', this._onclick);
    this._label.on('click', this._onclick);
    C.FeatureGroup_class.prototype.__added.apply(this, arguments);
};

ClusterGroup.prototype.__removed = function () {
    this._icon.off('click', this._onclick);
    this._label.off('click', this._onclick);
    C.FeatureGroup_class.prototype.__removed.apply(this, arguments);
};

ClusterGroup.prototype.onclick = function () {
    var bounds = this.getBounds();
    C.Events.zoomToBounds(bounds);
};

ClusterGroup.prototype.getCenter = function () {
    var bounds = this.getBounds();
    var center = bounds.getCenter();
    return C.Point(center.X, center.Y, 0, bounds._crs);
};

ClusterGroup.prototype.getBounds = function () {
    var bounds = C.Bounds();

    var children = this._node._children;
    for (var i = 0; i < children.length; ++i) {
        var feature = children[i]._feature;
        if (feature.getBounds) {
            bounds.extend(feature.getBounds());
        }
    }
    return bounds;
};

ClusterGroup.prototype.refresh = function () {
    var center = this.getCenter();

    this._icon.location(center);
    this._label.location(center);
    this._label.text(this._node.count());
    this._node._needRefresh = false;
};

var ClusterGrid = function (radius) {

    this._radius = radius;

    this._objects = [];

    this._layer = new C.BoundedLayer();

};

ClusterGrid.prototype = {

    addNode: function (node) {
        this._objects.push(node);
        this._layer.add(node._feature);
    },

    removeNode: function (node) {
        for (var i = 0; i < this._objects.length; ++i) {
            if (this._objects[i]._feature == node._feature) {
                this._layer.remove(node._feature);
                return this._objects.splice(i, 1)[0];
            }
        }
        return undefined;
    },

    removeFeature: function (feature) {
        for (var i = 0; i < this._objects.length; ++i) {
            if (this._objects[i]._feature == feature) {
                this._layer.remove(feature);
                return this._objects.splice(i, 1)[0];
            }
        }
        return undefined;
    },

    getNearNode: function (location) {

        var closestObject;
        var closestDistance;

        for (var i = 0; i < this._objects.length; ++i) {
            var obj = this._objects[i];
            var objLocation = obj.location();
            var dist = this.squareDist(location, objLocation);
            if (dist < this._radius && (!closestDistance || dist < closestDistance)) {
                closestDistance = dist;
                closestObject = obj;
            }
        }

        return closestObject;
    },

    squareDist: function (location1, location2) {
        return Math.sqrt( Math.pow(location1.X - location2.X, 2) + Math.pow(location1.Y - location2.Y, 2) );
    },

};

module.exports = Cluster;
