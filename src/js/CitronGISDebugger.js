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

    C.toto = osm;
    C.tata = layerGroup;

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

    /*for (var i = 0; i < 40; ++i) {
        for (var j = 0; j < 50; ++j) {
            layer.addFeature(new C.Geo.Feature.Circle({
                location: new C.Geometry.LatLng(j, i),
                radius: 2
            }));
        }
    }*/
};
