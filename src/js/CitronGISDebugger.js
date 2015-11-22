/*
**
**  CitronGISDebugger.js
**
**  Author citolen
**  12/01/2015
**
*/

var C = C || {};

function debugExtensionLoader(map, baseUrl) {

    C.Extension.Extension_ctr.call({_map: map}, new URLHandler({
        baseUrl: baseUrl
    }), function () {

    });
    //    new C.Extension.Extension(new URLHandler({
    //        baseUrl: baseUrl
    //    }), map, function (err, extension) {
    //
    //        if (err) {
    //            return console.log(err);
    //        }
    //
    //        C.Extension.Manager.register(extension);
    //
    //        extension._module.ui.on('display', function (element, nowindow) {
    //
    //            element.style.top = '50%';
    //            element.style.left = '50%';
    //            map._extDiv.appendChild(element);
    //
    //            if (!nowindow) {
    //                $(element).draggable({
    //                    containment: "#citrongis",
    //                    scroll: false,
    //                    handle: '.citrongisextension-header'
    //                });
    //            }
    //        });
    //
    //        extension.run();
    //    });
}

C.CitrongGISDebug = function (citronGIS) {
    console.log('--Debugger--');

    var layer = new C.Geo.Layer();

    citronGIS._layerManager.addLayer(layer);


    //    var owner = {};

    //    var layer = new C.Geo.Layer({
    //        name: 'Vector Layer',
    //        owner: owner
    //    });

    //    var test = new C.Layer.Tile.TileIndex.fromXYZ(10, 5, 2);
    //    //    console.log('BID', test);
    //
    //    var osm = new C.Layer.Tile.TileLayer({
    //
    //        name: 'Open Street Map',
    //
    //        //http://bcdcspatial.blogspot.com/2012/01/onlineoffline-mapping-map-tiles-and.html
    //        source: new C.Layer.Tile.Source.TMSSource({
    //            //            url: 'http://mt3.google.com/vt/lyrs=s,h&z={z}&x={x}&y={y}',
    //            /*server: undefined*/
    //            //            url: 'http://{server}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //            //            server: ['a', 'b', 'c']
    //            //url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'
    //            url: 'http://mt0.google.com/vt/lyrs=m@169000000&hl=en&x={x}&y={y}&z={z}&s=Ga'
    //            //url: 'https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q'
    //            //            url: 'https://b.tiles.mapbox.com/v3/aj.population-fire/{z}/{x}/{y}.png'
    //            //            url: 'https://a.tiles.mapbox.com/v3/aj.Sketchy2/{z}/{x}/{y}.png'
    //            /*url: 'http://{server}.tile.stamen.com/toner/{z}/{x}/{y}.png',
    //            server: ['a', 'b', 'c']*/
    //        }),
    //
    //        schema: C.Layer.Tile.Schema.SphericalMercator
    //
    //    });

    //    var tilelayers =[
    //        new C.Layer.Tile.TileLayer({
    //            name: 'MB sketchy',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'https://b.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q'
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercatorRetina}),
    //        new C.Layer.Tile.TileLayer({
    //            name: 'Google satellite',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'http://mt3.google.com/vt/lyrs=s,h&z={z}&x={x}&y={y}'
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercator}),
    //        new C.Layer.Tile.TileLayer({
    //            name: 'ArcGIS',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercator}),
    //        new C.Layer.Tile.TileLayer({
    //            name: 'Osm',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'http://{server}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //                server: ['a', 'b', 'c']
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercator}),
    //        new C.Layer.Tile.TileLayer({
    //            name: 'Stamen',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'http://a.tile.stamen.com/toner/{z}/{x}/{y}.png'
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercator}),
    //        new C.Layer.Tile.TileLayer({
    //            name: 'Google maps',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'http://mt0.google.com/vt/lyrs=m@169000000&hl=en&x={x}&y={y}&z={z}&s=Ga&scale=2'
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercatorRetina}),
    //        new C.Layer.Tile.TileLayer({
    //            name: 'Open Weather Map',
    //            source: new C.Layer.Tile.Source.TMSSource({
    //                url: 'http://undefined.tile.openweathermap.org/map/pressure_cntr/{z}/{x}/{y}.png'
    //            }),
    //            schema: C.Layer.Tile.Schema.SphericalMercator}),


    //    ];
    //
    //    var layerGroup = citronGIS._layerManager.createGroup(owner, {
    //        name: 'Simple Group'
    //    });
    //
    //    $('#select_tilelayer_drop').on('change', function (e) {
    //        var optionSelected = $("option:selected", this);
    //        var valueSelected = parseInt(this.value);
    //
    //        for (var i = 0; i < tilelayers.length; ++i) {
    //            layer.remove(tilelayers[i]);
    //        }
    //        layer.add(tilelayers[valueSelected]);
    //    });
    //
    //    tilelayers[0].addTo(layer);

    //    var l1 = new C.Geo.Layer();
    //
    //    var fg = new C.Geo.FeatureGroup();
    //
    //    var c1 = new C.Geo.Feature.Circle({
    //        location: new C.Geometry.LatLng(48, 2),
    //        radius: 20
    //    });
    //    var c2 = new C.Geo.Feature.Circle({
    //        location: new C.Geometry.LatLng(49, 2),
    //        radius: 20
    //    });
    //    console.log('s');
    //    c1.addTo(fg);
    //    c2.addTo(fg);
    //
    //    fg.addTo(l1);
    //    l1.addTo(layer);
    //
    //    setTimeout(function () {
    //        layer.remove(l1);
    //
    //        fg.remove(c1);
    //        fg.add(c1);
    //        setTimeout(function () {
    //            layer.add(l1);
    //        }, 2000);
    //    }, 5000);

    //    var test_text = new C.Geo.Feature.Text({
    //        location: new C.Geometry.LatLng(48.861005, 2.340435),
    //        text: 'bonjour',
    //        fill: 0xff0000,
    //        align: C.Geo.Feature.Text.TextAlign.CENTER,
    //        anchor: [0.5, 0.5],
    //        font: '20px Arial'
    //    });
    //    console.log(test_text);
    //    test_text.addTo(layer);
    //        layer.addTo(layerGroup);

    //    var ti = new C.Layer.Tile.TileIndex.fromXYZ(9376, 12530, 15);
    //    ti = C.Layer.Tile.Schema.SphericalMercator.tileToWorld(ti, C.Layer.Tile.Schema.SphericalMercator._resolutions[15]);
    //    var pt = new C.Geometry.Point(ti.X, ti.Y, 0, C.Helpers.schema._crs);
    //    pt.TransformTo(C.Helpers.ProjectionsHelper.WGS84);
    //    console.log(pt);
    //
    //    layerGroup.addLayer(osm);
    //    layerGroup.addLayer(layer);
    //
    //    C.toto = osm;
    //    C.tata = layerGroup;

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
    //    var c;
    //    layer.addFeature(c = new C.Geo.Feature.Polygon({
    //        locations: [
    //            new C.Geometry.LatLng(-55.679726, -68.288577),
    //            new C.Geometry.LatLng(-18.316418, -70.573733),
    //            new C.Geometry.LatLng(-5.094729, -81.823733),
    //            new C.Geometry.LatLng(12.722377, -73.913577),
    //            new C.Geometry.LatLng(-6.493759, -34.187013)
    //        ],
    //        fillColor: 0x6e6eff,
    //        outlineWidth: 5
    //    }));
    //
    //    var f = new C.Geo.Feature.Circle({
    //        location: new C.Geometry.LatLng(48.8156, 2.362886),
    //        radius: 10
    //    });
    //    f.on('mousedown', function (f, e) {
    //        e.data.originalEvent.stopPropagation();
    //    });
    //    f.on('mouseup', function () {
    //        console.log('up');
    //    });
    //    f.addTo(layer);
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
    //    var c1;
    //    layer.addFeature((c1 = new C.Geo.Feature.Circle({
    //        location: new C.Geometry.LatLng(46.795288, -71.245136),
    //        radius: 5
    //    })));
    //    //
    //    var contentString = '<div id="content">'+
    //        '<div id="siteNotice">'+
    //        '</div>'+
    //        '<h1 id="firstHeading" class="firstHeading">toto</h1>'+
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
    //    var contentString1 = '<div id="content">'+
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
    //    var p = new C.UI.Popup(c, {
    //        content: contentString,
    //        auto: false
    //    });
    //
    //    var p1 = new C.UI.Popup(c1, {
    //        content: contentString1,
    //        auto: false
    //    });
    //    //
    //
    //    c.bindPopup(p);
    //        c1.bindPopup(p1);
    //
    //        c.on('click', function () {
    //            console.log(arguments);
    //            //p.open();
    //        });


    debugExtensionLoader(citronGIS, './src/modules/scale/');
    //    debugExtensionLoader(citronGIS, './src/modules/search/');
    //    debugExtensionLoader(citronGIS, './src/modules/ourmap/');
    //    debugExtensionLoader(citronGIS, './src/modules/game/');
    //    debugExtensionLoader(citronGIS, './src/modules/satellite/');
    //    debugExtensionLoader(citronGIS, './src/modules/instagram/');
    //    debugExtensionLoader(citronGIS, '/src/modules/welcome/');
    //        debugExtensionLoader(citronGIS, '/src/modules/distance/');
    //    debugExtensionLoader(citronGIS, '/src/modules/layer-manager/');
    //    debugExtensionLoader(citronGIS, '/src/modules/velib/');
    //    debugExtensionLoader(citronGIS, '/src/modules/editor/');
    //    debugExtensionLoader(citronGIS, '/src/modules/flight/');
    //                debugExtensionLoader(citronGIS, '/src/modules/what3words/');
    //    debugExtensionLoader(citronGIS, '/src/modules/extensionTest/');
    //    debugExtensionLoader(citronGIS, '/src/modules/csv/');
    //    debugExtensionLoader(citronGIS, '/src/modules/testRequest/');
};
