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

    citronGIS._layerManager.on('featureChange', function (eventType, feature) {
        console.log(eventType, feature);
    });

    citronGIS._layerManager.on('layerChange', function (eventType, layer) {
        console.log(eventType, layer);
    });

    citronGIS._layerManager.on('groupChange', function (eventType, group) {
        console.log(eventType, group);
    });

    var owner = {};

    var layer = new C.Geo.Layer({
        name: 'Vector Layer',
        owner: owner
    });

    var layerGroup = citronGIS._layerManager.createGroup(owner, {
        name: 'Simple Group'
    });

    layerGroup.addLayer(layer);

    var circle = new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(0,0),
        radius: 10
    });

    layer.addFeature(circle);

    layer.addFeature(new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(43.306426, -0.415039),
        radius: 10
    }));

    layer.addFeature(new C.Geo.Feature.Line({
        locations: [
            new C.Geometry.LatLng(43.306426, -0.415039),
            new C.Geometry.LatLng(0, 0)
        ],
        lineColor: 0xff0000
    }));

    //43.306426, -0.415039

    /*circle.outlineWidth(2);
    layer.removeFeature(circle);
    layerGroup.removeLayer(layer);
    citronGIS._layerManager.deleteGroup(owner, layerGroup);*/
};
