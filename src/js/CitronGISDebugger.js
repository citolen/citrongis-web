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

    /*citronGIS._layerManager.on('featureChange', function (eventType, feature) {
        console.log(eventType, feature);
    });

    citronGIS._layerManager.on('layerChange', function (eventType, layer) {
        console.log(eventType, layer);
    });

    citronGIS._layerManager.on('groupChange', function (eventType, group) {
        console.log(eventType, group);
    });*/

    var owner = {};

    var layer = new C.Geo.Layer({
        name: 'Vector Layer',
        owner: owner
    });

    var osm = new C.Layer.Tile.TileLayer({

        name: 'Open Street Map',

        //http://bcdcspatial.blogspot.com/2012/01/onlineoffline-mapping-map-tiles-and.html
        source: new C.Layer.Tile.Source.TMSSource({
            //url: 'http://mt3.google.com/vt/lyrs=s,h&z={z}&x={x}&y={y}'/*,
            /*server: undefined*/
            /*url: 'http://{server}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            server: ['a', 'b', 'c']*/
            //url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'
            url: 'http://mt0.google.com/vt/lyrs=m@169000000&hl=en&x={x}&y={y}&z={z}&s=Ga'
            //url: 'https://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q'
        }),

        schema: C.Layer.Tile.Schema.SphericalMercator

    });

    var layerGroup = citronGIS._layerManager.createGroup(owner, {
        name: 'Simple Group'
    });

    layerGroup.addLayer(osm);
    layerGroup.addLayer(layer);

    //osm.opacity(0.5);


    /*var tile = new C.Geo.Feature.Image({
        location: new C.Geometry.LatLng(0, 0),
        width: 256,
        height: 256,
        anchorX: 0.5,
        anchorY: 0.5,
        source: 'http://a.basemaps.cartocdn.com/light_all/0/0/0.png'
    });
    osm.addFeature(tile);
    tile.on('loaded', function () {
        console.log('loaded');
        tile.__graphics.alpha = 0;
        (function f() {
            if (tile.__graphics.alpha < 1)
                setTimeout(f, 70);
            tile.__graphics.alpha += 0.1;
            if (tile.__graphics.alpha > 1)
                tile.__graphics.alpha = 1;
        })();

    });
    tile.load();*/

    citronGIS._viewport.on('move', function (viewport, type) {

        'use strict';

        C.Layer.Tile.Schema.SphericalMercator.computeTiles(viewport);
        /*var size = (osm._schema._resolutions[0] / viewport._resolution) * 256;
        tile.width(size);
        tile.height(size);*/
    });


    layer.addFeature(new C.Geo.Feature.Line({
        locations: [
            new C.Geometry.LatLng(48.851913, 2.346030),
            new C.Geometry.LatLng(33.790271, -118.136604)
        ],
        lineColor: 0xff0000
    }));

    layer.addFeature(new C.Geo.Feature.Line({
        locations: [
            new C.Geometry.LatLng(48.851913, 2.346030),
            new C.Geometry.LatLng(33.154932, -117.157433)
        ],
        lineColor: 0xff0000
    }));

    layer.addFeature(new C.Geo.Feature.Line({
        locations: [
            new C.Geometry.LatLng(48.851913, 2.346030),
            new C.Geometry.LatLng(46.795288, -71.245136)
        ],
        lineColor: 0xff0000
    }));

    layer.addFeature(new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(48.851913, 2.346030),
        radius: 2
    }));

    layer.addFeature(new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(33.790271, -118.136604),
        radius: 2
    }));

    layer.addFeature(new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(33.154932, -117.157433),
        radius: 2
    }));

    layer.addFeature(new C.Geo.Feature.Circle({
        location: new C.Geometry.LatLng(46.795288, -71.245136),
        radius: 2
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

    C.Helpers.CoordinatesHelper.TransformTo(new C.Geometry.LatLng(-55.679726, -68.288577), C.Helpers.ProjectionsHelper.EPSG3857);
    //layer.addFeature(southAmerica);

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
