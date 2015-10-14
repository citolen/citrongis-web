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
    this._initialize();

}, C.Layer_class);

Cluster.prototype._initialize = function () {
    if (!this._maxZoom) {
        this._maxZoom = C.Viewport.getMaxZoomLevel();
    }
    for (var i = 0; i <= this._maxZoom; ++i) {
        this._clusterGrids[i] = new ClusterGrid(150 * C.Viewport.getResolutionAtZoomLevel(i));
        this._unclusterGrids[i] = new ClusterGrid(150 * C.Viewport.getResolutionAtZoomLevel(i));
    }
};

Cluster.prototype.__added = function () {
    C.Events.on('zoomend', this._refresh.bind(this));
    C.Layer_class.prototype.__added.apply(this, arguments);
};

Cluster.prototype.__removed = function () {
    C.Events.off('zoomend', this._refresh.bind(this));
    C.Layer_class.prototype.__removed.apply(this, arguments);
};

Cluster.prototype.add = function (feature) {
    if (!feature) { //check instanceof C.Geo.Feature.Feature
        return;
    }
    this._add(feature);
};

//Cluster.prototype.remove = function (feature) {
//    if (!feature) { return; }
//    this._remove(feature);
//};

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

Cluster.prototype._add = function (feature) {
    switch (feature._type) {
        case C.FeatureType.CIRCLE:
        case C.FeatureType.IMAGE:
        case C.FeatureType.TEXT:
            this._clusteringFeature.push(feature);
            this._addObjectToCluster(feature);
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

    var removedNode = cluster;
    console.log(removedNode);
    cluster = cluster._parent;
    console.log(cluster);

    if (cluster._zoom >= 0) {

        cluster.removeChild(removedNode);

        if (cluster._children.length <= 1) {
            console.log(cluster, 'need to be dislocated');
        } else {
            console.log('refresh', cluster._zoom);
            while (cluster._zoom >= 0) {
                cluster._feature.refresh();
                cluster = cluster._parent;
            }
        }
    }
};

Cluster.prototype._addObjectToCluster = function (feature) {

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
            closestCluster.addChild(node);
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
            clusterNode.addChild(closestNode);
            clusterNode.addChild(node);
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
                clusterNode.addChild(lastParent);
                this._clusterGrids[z].addNode(clusterNode);
                lastParent = clusterNode;
            }
            parent.addChild(lastParent);
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

    addChild: function (node) {
        this._children.push(node);
        node._parent = this;
        if (this._feature) {
            this._feature.refresh();
            var parent = this._parent;
            while (parent) {
                parent._needRefresh = true;
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
        backgroundColor: 0xe67e22,
        outlineColor: 0xf39c12,
        outlineWidth: 4,
        radius: 22,
        opacity: 1
    });

    //    this._icon = C.Circle({
    //        location: C.LatLng(0,0),
    //        backgroundColor: 0x27ae60,
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

}, C.FeatureGroup_class);

ClusterGroup.prototype = C.Utils.Extends(ClusterGroup.prototype, {

    getCenter: function () {
        var bounds = this.getBounds();
        var center = bounds.getCenter();
        return C.Point(center.X, center.Y, 0, bounds._crs);
    },

    getBounds: function () {
        var bounds = C.Bounds();

        var children = this._node._children;
        for (var i = 0; i < children.length; ++i) {
            var feature = children[i]._feature;
            if (feature.getBounds) {
                bounds.extend(feature.getBounds());
            }
        }
        return bounds;
    },

    refresh: function () {
        var center = this.getCenter();

        this._icon.location(center);
        this._label.location(center);
        this._label.text(this._node.count());
        this._node._needRefresh = false;
    }

});

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
