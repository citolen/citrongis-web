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

    var tile = new C.Geo.Feature.Image({
        location: new C.Geometry.LatLng(0, 0),
        width: 256,
        height: 256,
        anchorX: 0.5,
        anchorY: 0.5,
        source: 'http://a.tile.openstreetmap.org/0/0/0.png'
    });
    layer.addFeature(tile);

    citronGIS.on('viewportMove', function (viewport, type) {

        'use strict';

        if (type != C.System.Events.viewportMoveType.ZOOM) return;

        var size = (Math.abs(viewport._schema._extent._minX) + Math.abs(viewport._schema._extent._maxX)) / viewport._resolution;
        tile.width(size);
        tile.height(size);
    });

    var circle = new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(0,0),
        radius: 2
    });

    layer.addFeature(circle);

    layer.addFeature(new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(43.306426, -0.415039),
        radius: 2
    }));

    layer.addFeature(new C.Geo.Feature.Line({
        locations: [
            new C.Geometry.LatLng(43.306426, -0.415039),
            new C.Geometry.LatLng(0, 0)
        ],
        lineColor: 0xff0000
    }));

    var southAmerica = new C.Geo.Feature.Polygon({
        locations: [
            new C.Geometry.LatLng(-55.679726, -68.288577),
            new C.Geometry.LatLng(-18.316418, -70.573733),
            new C.Geometry.LatLng(-5.094729, -81.823733),
            new C.Geometry.LatLng(12.722377, -73.913577),
            new C.Geometry.LatLng(-6.493759, -34.187013)
        ],
        fillColor: 0x6e6eff,
        outlineWidth: 2
    });

    layer.addFeature(southAmerica);

    setTimeout(function () {
        southAmerica.outlineColor(0x00FF00);
        southAmerica.fillColor(0xFF0000);
        southAmerica.outlineWidth(5);
    }, 3000);

    //43.306426, -0.415039

    /*circle.outlineWidth(2);
    layer.removeFeature(circle);
    layerGroup.removeLayer(layer);
    citronGIS._layerManager.deleteGroup(owner, layerGroup);*/
};
