/*
**
**  CitronGISDebugger.js
**
**  Author citolen
**  12/01/2015
**
*/

var C = C || {};

C.CitrongGISDebug = function (citronGIS) {
    console.log('--Debugger--');

    var owner = {};

    var layer = new C.Geo.Layer({
        name: 'Vector Layer',
        owner: owner
    });

    var layerGroup = citronGIS._layerManager.createGroup(owner, {
        name: 'Simple Group'
    });

    layerGroup.addLayer(layer);

    citronGIS._layerManager.on('featureChange', function (eventType, feature) {
        console.log(eventType, feature);
    });

    var circle = new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(0,0)
    });

    layer.addFeature(circle);
    circle.outlineWidth(2);
    layer.removeFeature(circle);
};
