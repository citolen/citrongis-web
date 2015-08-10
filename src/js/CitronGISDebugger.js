/*
**
**  CitronGISDebugger.js
**
**  Author citolen
**  12/01/2015
**
*/

var C = C || {};

function debugExtensionLoader(citronGIS, baseUrl) {
    var e = new C.Extension.Extension(new URLHandler({
        baseUrl: baseUrl
    }), citronGIS._layerManager);
    C.Extension.Manager.register(e);

    e.module.ui.on('display', function (element) {
        /*var container = document.createElement('DIV');
        container.appendChild(element);
        container.className = "extension-container";*/

        citronGIS._extDiv.appendChild(element);
        $(element).draggable({
            containment: "#citrongis",
            scroll: false,
            handle: '.ui-header'
        });
    });

    e.run();
}

C.CitrongGISDebug = function (citronGIS) {
    console.log('--Debugger--');

    var owner = {};

    var layer = new C.Geo.Layer({
        name: 'Vector Layer',
        owner: owner
    });

    var test = new C.Layer.Tile.TileIndex.fromXYZ(10, 5, 2);
    console.log('BID', test);

    var osm = new C.Layer.Tile.TileLayer({

        name: 'Open Street Map',

        //http://bcdcspatial.blogspot.com/2012/01/onlineoffline-mapping-map-tiles-and.html
        source: new C.Layer.Tile.Source.TMSSource({
//            url: 'http://mt3.google.com/vt/lyrs=s,h&z={z}&x={x}&y={y}',
            /*server: undefined*/
//            url: 'http://{server}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//            server: ['a', 'b', 'c']
            //url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'
            url: 'http://mt0.google.com/vt/lyrs=m@169000000&hl=en&x={x}&y={y}&z={z}&s=Ga'
            //url: 'https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q'
//            url: 'https://b.tiles.mapbox.com/v3/aj.population-fire/{z}/{x}/{y}.png'
//            url: 'https://a.tiles.mapbox.com/v3/aj.Sketchy2/{z}/{x}/{y}.png'
            /*url: 'http://{server}.tile.stamen.com/toner/{z}/{x}/{y}.png',
            server: ['a', 'b', 'c']*/
        }),

        schema: C.Layer.Tile.Schema.SphericalMercator

    });

    var layerGroup = citronGIS._layerManager.createGroup(owner, {
        name: 'Simple Group'
    });

    var ti = new C.Layer.Tile.TileIndex.fromXYZ(9376, 12530, 15);
    ti = C.Layer.Tile.Schema.SphericalMercator.tileToWorld(ti, C.Layer.Tile.Schema.SphericalMercator._resolutions[15]);
    var pt = new C.Geometry.Point(ti.X, ti.Y, 0, C.Helpers.schema._crs);
    pt.TransformTo(C.Helpers.ProjectionsHelper.WGS84);
    console.log(pt);

    layerGroup.addLayer(osm);
    layerGroup.addLayer(layer);

    C.toto = osm;
    C.tata = layerGroup;

//    layer.addFeature(new C.Geo.Feature.Line({
//        locations: [
//            new C.Geometry.LatLng(48.851913, 2.346030),
//            new C.Geometry.LatLng(33.790271, -118.136604)
//        ],
//        lineColor: 0xff0000
//    }));
//
//    layer.addFeature(new C.Geo.Feature.Line({
//        locations: [
//            new C.Geometry.LatLng(48.851913, 2.346030),
//            new C.Geometry.LatLng(33.154932, -117.157433)
//        ],
//        lineColor: 0xff0000
//    }));
//
//    layer.addFeature(new C.Geo.Feature.Line({
//        locations: [
//            new C.Geometry.LatLng(48.851913, 2.346030),
//            new C.Geometry.LatLng(46.795288, -71.245136)
//        ],
//        lineColor: 0xff0000
//    }));
//
//    layer.addFeature(new C.Geo.Feature.Circle({
//        location: new C.Geometry.LatLng(38.94232099793376, -76.99218751775437),
//        radius: 2
//    }));
//
//    layer.addFeature(new C.Geo.Feature.Circle({
//        location: new C.Geometry.LatLng(33.790271, -118.136604),
//        radius: 2
//    }));
//
//    layer.addFeature(new C.Geo.Feature.Circle({
//        location: new C.Geometry.LatLng(33.154932, -117.157433),
//        radius: 2
//    }));
//
//    var c;
//    layer.addFeature((c = new C.Geo.Feature.Circle({
//        location: new C.Geometry.LatLng(46.795288, -71.245136),
//        radius: 5
//    })));
//
//    var contentString = '<div id="content">'+
//        '<div id="siteNotice">'+
//        '</div>'+
//        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//        '<div id="bodyContent">'+
//        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//        'sandstone rock formation in the southern part of the '+
//        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//        'south west of the nearest large town, Alice Springs; 450&#160;km '+
//        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//        'Aboriginal people of the area. It has many springs, waterholes, '+
//        'rock caves and ancient paintings. Uluru is listed as a World '+
//        'Heritage Site.</p>'+
//        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//        '(last visited June 22, 2009).</p>'+
//        '</div>'+
//        '</div>';
//
//    var p = new C.UI.Popup(c, {
//        content: contentString,
//        auto: false
//    });
//
//    c.on('click', function () {
//        p.open();
//    });

    /*for (var i = 0; i < 40; ++i) {
        for (var j = 0; j < 50; ++j) {
            layer.addFeature(new C.Geo.Feature.Circle({
                location: new C.Geometry.LatLng(j, i),
                radius: 2
            }));
        }
    }*/

    debugExtensionLoader(citronGIS, '/src/modules/scale/');
    debugExtensionLoader(citronGIS, '/src/modules/distance/');
    debugExtensionLoader(citronGIS, '/src/modules/layer-manager/');
//    debugExtensionLoader(citronGIS, '/tests/velib/');
};
