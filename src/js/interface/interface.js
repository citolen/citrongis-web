/*
 *  interface.js    //TODO description
 */

var C = C || {};

C.Interface = function () {

    this._root;
    this._container;
    this._grid;

};

C.Interface.prototype.init = function (root, map) {
    this._root = root;
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'citrongis-interface';
    this._root.appendChild(this._container);

    this._grid = new C.Interface.Grid(this._container);

    var layerButton = new C.Interface.ButtonBlock({
        x: 1,
        y: 1,
        width: 5,
        height: 1,
        float: C.Interface.BlockFloat.topRight,
        content: '<i class="fa fa-map-o"></i>&nbsp;Mapbox',
        css: {
            borderRadius: '4px',
            fontWeight: 'normal',
            fontSize: '15px',
            textAlign: 'left',
            paddingLeft: '10px'
        }
    });
    this._grid.addBlock(layerButton);

    var layerWindow = new C.Interface.TileLayerBlock({
        x: layerButton.getX(),
        y: layerButton.getY() + 1,
        width: 7,
        height: 10,
        float: C.Interface.BlockFloat.topRight,
        content: '',
        css: {
            borderRadius: '4px 4px 4px 4px',
            borderBottom: 'solid 5px #ffffff',
            fontWeight: 'normal',
            overflow: 'hidden'
        }
    });
    layerWindow.addTileLayer('img/preview_mapbox.jpg', 'Mapbox', 0);
    layerWindow.addTileLayer('img/preview_satellite.jpg', 'Satellite', 1);
    layerWindow.addTileLayer('img/preview_arcgis.jpg', 'Arcgis', 2);
    layerWindow.addTileLayer('img/preview_osm.jpg', 'OpenStreetMap', 3);
    layerWindow.addTileLayer('img/preview_stamen.jpg', 'Toner', 4);
    layerWindow.addTileLayer('img/preview_google.jpg', 'Google', 5);
    var tilelayers =[
        new C.Layer.Tile.TileLayer({
            name: 'Mapbox',
            source: new C.Layer.Tile.Source.TMSSource({
                url: 'https://b.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q'
            }),
            schema: C.Layer.Tile.Schema.SphericalMercatorRetina}),
        new C.Layer.Tile.TileLayer({
            name: 'Satellite',
            source: new C.Layer.Tile.Source.TMSSource({
                url: 'http://mt3.google.com/vt/lyrs=s,h&z={z}&x={x}&y={y}'
            }),
            schema: C.Layer.Tile.Schema.SphericalMercator}),
        new C.Layer.Tile.TileLayer({
            name: 'ArcGIS',
            source: new C.Layer.Tile.Source.TMSSource({
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'
            }),
            schema: C.Layer.Tile.Schema.SphericalMercator}),
        new C.Layer.Tile.TileLayer({
            name: 'OSM',
            source: new C.Layer.Tile.Source.TMSSource({
                url: 'http://{server}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                server: ['a', 'b', 'c']
            }),
            schema: C.Layer.Tile.Schema.SphericalMercator}),
        new C.Layer.Tile.TileLayer({
            name: 'Toner',
            source: new C.Layer.Tile.Source.TMSSource({
                url: 'http://a.tile.stamen.com/toner/{z}/{x}/{y}.png'
            }),
            schema: C.Layer.Tile.Schema.SphericalMercator}),
        new C.Layer.Tile.TileLayer({
            name: 'Google',
            source: new C.Layer.Tile.Source.TMSSource({
                url: 'http://mt0.google.com/vt/lyrs=m@169000000&hl=en&x={x}&y={y}&z={z}&s=Ga&scale=2'
            }),
            schema: C.Layer.Tile.Schema.SphericalMercatorRetina})
    ];
    var layer = new C.Geo.Layer();
    map._layerManager.addLayer(layer);
    tilelayers[0].addTo(layer);
    var currentId = 0;
    var self = this;
    layerWindow.on('select', function (id) {
        if (id == currentId) { return; }
        layer.clearLayer();
        tilelayers[id].addTo(layer);
        currentId = id;
        self._grid.removeBlock(layerWindow);
        layerWindowOpen = false;
        layerButton.setContent('<i class="fa fa-map-o"></i>&nbsp;' + tilelayers[id]._name);
    });
    var layerWindowOpen = false;
    layerButton.on('click', function () {
        if (!layerWindowOpen) {
            self._grid.addBlock(layerWindow);
        } else {
            self._grid.removeBlock(layerWindow);
        }
        layerWindowOpen = !layerWindowOpen;
    });


    var zoomInButton = new C.Interface.ButtonBlock({
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '+',
        css: {
            borderRadius: '4px 4px 0px 0px',
            fontWeight: 'bold'
        }
    });
    this._grid.addBlock(zoomInButton);
    var zoomOutButton = new C.Interface.ButtonBlock({
        x: 1,
        y: 2,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '-',
        css: {
            borderRadius: '0px 0px 4px 4px',
            borderTop: 'none',
            fontWeight: 'bold'
        }
    });
    this._grid.addBlock(zoomOutButton);

    var velibbtn = new C.Interface.ButtonBlock({
        x: 5,
        y: 1,
        width: 2,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: 'velib',
        css: {
            borderRadius: '4px 0px 0px 4px',
            fontWeight: 'normal',
            fontSize: '15px',
            boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 5px -3px rgba(0,0,0,0.65)'
        }
    });
    this._grid.addBlock(velibbtn);
    var w3w = new C.Interface.ButtonBlock({
        x: 7,
        y: 1,
        width: 4,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: 'what3words',
        css: {
            borderRadius: '0px 0px 0px 0px',
            fontWeight: 'normal',
            fontSize: '15px',
            boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 5px -3px rgba(0,0,0,0.65)'
        }
    });
    this._grid.addBlock(w3w);
    var distance = new C.Interface.ButtonBlock({
        x: 11,
        y: 1,
        width: 3,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: 'distance',
        css: {
            borderRadius: '0px 0px 0px 0px',
            fontWeight: 'normal',
            fontSize: '15px',
            boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 5px -3px rgba(0,0,0,0.65)'
        }
    });
    this._grid.addBlock(distance);
    var csv = new C.Interface.ButtonBlock({
        x: 14,
        y: 1,
        width: 2,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: 'csv',
        css: {
            borderRadius: '0px 0px 0px 0px',
            fontWeight: 'normal',
            fontSize: '15px',
            boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 5px -3px rgba(0,0,0,0.65)'
        }
    });
    this._grid.addBlock(csv);
    var editor = new C.Interface.ButtonBlock({
        x: 16,
        y: 1,
        width: 2,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: 'editor',
        css: {
            borderRadius: '0px 4px 4px 0px',
            fontWeight: 'normal',
            fontSize: '15px',
            boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 5px -3px rgba(0,0,0,0.65)'
        }
    });
    this._grid.addBlock(editor);

    var self = this;

    var velib_loaded = false;
    var velib_ext;
    velibbtn.on('click', function () {
        if (!velib_loaded) {
            velib_loaded = true;
            C.Extension.Extension_ctr.call({_map: self._map}, new URLHandler({
                baseUrl: '/src/modules/velib/'
            }), function (err, ext) {
                velib_ext = ext;
                velib_ext._module.ui.on('destroy', function () {
                    velib_loaded = false;
                });
                velib_ext.on('stopped', function () {
                    ga('send', 'pageview', 'Velib/Destroy');
                });
            });
            ga('send', 'pageview', 'Velib/Open');
        } else {
            velib_ext.destroy();
        }
    });

    var w3w_loaded = false;
    var w3w_ext;
    w3w.on('click', function () {
        if (!w3w_loaded) {
            w3w_loaded = true;
            C.Extension.Extension_ctr.call({_map: self._map}, new URLHandler({
                baseUrl: '/src/modules/what3words/'
            }), function (err, ext) {
                w3w_ext = ext;
                w3w_ext._module.ui.on('destroy', function () {
                    w3w_loaded = false;
                });
                w3w_ext.on('stopped', function () {
                    ga('send', 'pageview', 'W3W/Destroy');
                });
            });
            ga('send', 'pageview', 'W3W/Open');
        } else {
            w3w_ext.destroy();
        }
    });

    var distance_loaded = false;
    var distance_ext;
    distance.on('click', function () {
        if (!distance_loaded) {
            distance_loaded = true;
            C.Extension.Extension_ctr.call({_map: self._map}, new URLHandler({
                baseUrl: '/src/modules/distance/'
            }), function (err, ext) {
                distance_ext = ext;
                distance_ext._module.ui.on('destroy', function () {
                    distance_loaded = false;
                });
                distance_ext.on('stopped', function () {
                    ga('send', 'pageview', 'Distance/Destroy');
                });
            });
            ga('send', 'pageview', 'Distance/Open');
        } else {
            distance_ext.destroy();
        }
    });

    var csv_loaded = false;
    var csv_ext;
    csv.on('click', function () {
        if (!csv_loaded) {
            csv_loaded = true;
            C.Extension.Extension_ctr.call({_map: self._map}, new URLHandler({
                baseUrl: '/src/modules/csv/'
            }), function (err, ext) {
                csv_ext = ext;
                csv_ext._module.ui.on('destroy', function () {
                    csv_loaded = false;
                });
                csv_ext.on('stopped', function () {
                    ga('send', 'pageview', 'CSV/Destroy');
                });
            });
            ga('send', 'pageview', 'CSV/Open');
        } else {
            csv_ext.destroy();
        }
    });

    var editor_loaded = false;
    var editor_ext;
    editor.on('click', function () {
        if (!editor_loaded) {
            editor_loaded = true;
            C.Extension.Extension_ctr.call({_map: self._map}, new URLHandler({
                baseUrl: '/src/modules/editor/'
            }), function (err, ext) {
                editor_ext = ext;
                editor_ext._module.ui.on('destroy', function () {
                    editor_loaded = false;
                });
                editor_ext.on('stopped', function () {
                    ga('send', 'pageview', 'Editor/Destroy');
                });
            });
            ga('send', 'pageview', 'Editor/Open');
        } else {
            editor_ext.destroy();
        }
    });

    //menu btn
    //    var blocklogIn = new C.Interface.ButtonBlock({
    //        x: 3,
    //        y: 0,
    //        width: 1,
    //        height: 1,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '<img src="../../src/css/img/menu_user.png" style="height: 75%"/>',
    //        css: {
    //            borderRadius: '4px 0px 0px 4px',
    //            borderBottom: 'solid 5px #3498db',
    //            fontWeight: 'bold',
    //            boxShadow: 'none',
    //            position: 'absolute'
    //        }
    //    });
    //    this._grid.addBlock(blocklogIn);
    //    var blockStore = new C.Interface.ButtonBlock({
    //        x: 4,
    //        y: 0,
    //        width: 1,
    //        height: 1,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '<img src="../../src/css/img/menu_bag.png" style="height: 75%"/>',
    //        css: {
    //            borderRadius: '0px 0px 0px 0px',
    //            borderBottom: 'solid 5px #2ecc71',
    //            fontWeight: 'bold',
    //            boxShadow: 'none'
    //        }
    //    });
    //    this._grid.addBlock(blockStore);
    //    var blockSettings = new C.Interface.ButtonBlock({
    //        x: 5,
    //        y: 0,
    //        width: 1,
    //        height: 1,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '<img src="../../src/css/img/menu_settings.png" style="height: 75%"/>',
    //        css: {
    //            borderRadius: '0px 0px 0px 0px',
    //            borderBottom: 'solid 5px #e67e22',
    //            fontWeight: 'bold',
    //            boxShadow: 'none'
    //        }
    //    });
    //    this._grid.addBlock(blockSettings);
    //    var blockSearch = new C.Interface.ButtonBlock({
    //        x: 6,
    //        y: 0,
    //        width: 1,
    //        height: 1,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '<img src="../../src/css/img/menu_search.png" style="height: 75%"/>',
    //        css: {
    //            borderRadius: '0px 4px 4px 0px',
    //            borderBottom: 'solid 5px #f1c40f',
    //            fontWeight: 'bold',
    //            boxShadow: 'none'
    //        }
    //    });
    //    this._grid.addBlock(blockSearch);
    //
    //    //menu windows
    //    var windowUserLogin = new C.Interface.WindowBlock({
    //        x: blocklogIn.getX(),
    //        y: blocklogIn.getY() + 1,
    //        width: 15,
    //        height: 15,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '',
    //        css: {
    //            borderRadius: '4px 4px 4px 4px',
    //            borderBottom: 'solid 5px #3498db',
    //            fontWeight: 'bold',
    //            boxShadow: 'none',
    //            display: 'none'
    //        }
    //    });
    //    this._grid.addBlock(windowUserLogin);
    //
    //    var windowStore = new C.Interface.WindowBlock({
    //        x: blockStore.getX(),
    //        y: blockStore.getY() + 1,
    //        width: 20,
    //        height: 20,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '<store-citrongis></store-citrongis>',
    //        css: {
    //            borderRadius: '4px 4px 4px 4px',
    //            borderBottom: 'solid 5px #2ecc71',
    //            fontWeight: 'bold',
    //            boxShadow: 'none',
    //            display: 'none'
    //        }
    //    });
    //    this._grid.addBlock(windowStore);
    //
    //    var windowSearch = new C.Interface.WindowBlock({
    //        x: blockSearch.getX(),
    //        y: blockSearch.getY() + 1,
    //        width: 15,
    //        height: 15,
    //        float: C.Interface.BlockFloat.topLeft,
    //        content: '<search-citrongis></search-citrongis>',
    //        css: {
    //            borderRadius: '4px 4px 4px 4px',
    //            borderBottom: 'solid 5px #f1c40f',
    //            fontWeight: 'bold',
    //            boxShadow: 'none',
    //            display: 'none'
    //        }
    //    });
    //    this._grid.addBlock(windowSearch);
    //
    zoomInButton.on('click', function () {
        C.System.Events.zoomInWithAnimation();
    });
    zoomOutButton.on('click', function () {
        C.System.Events.zoomOutWithAnimation();
    });
    //    blocklogIn.on('click', function () {
    //        if (windowUserLogin.isVisible() == false) {
    //            windowUserLogin.setCSS('display', 'block');
    //
    //            if (Utils.check_log_in() == "login") {
    //                blocklogIn.setCSS('backgroundColor', '#3498db');
    //                windowUserLogin.setContent("<profile-citrongis></profile-citrongis>");
    //            }
    //            else {
    //                blocklogIn.setCSS('backgroundColor', '#3498db');
    //                windowUserLogin.setContent("<user-citrongis></user-citrongis>");
    //            }
    //        }
    //        else {
    //            blocklogIn.setCSS('backgroundColor', '');
    //            windowUserLogin.setCSS('display', 'none');
    //        }
    //    });
    //    blockStore.on('click', function () {
    //        if (windowStore.isVisible() == false) {
    //            blockStore.setCSS('backgroundColor', '#2ecc71');
    //            windowStore.setCSS('display', 'block');
    //        }
    //        else {
    //            blockStore.setCSS('backgroundColor', '');
    //            windowStore.setCSS('display', 'none');
    //        }
    //    });
    //    blockSearch.on('click', function () {
    //        if (windowSearch.isVisible() == false) {
    //            blockSearch.setCSS('backgroundColor', '#f1c40f');
    //            windowSearch.setCSS('display', 'block');
    //        }
    //        else {
    //            blockSearch.setCSS('backgroundColor', '');
    //            windowSearch.setCSS('display', 'none');
    //        }
    //    });

};

C.Interface.prototype.resize = function (width, height) {

    this._grid.resize(width, height);

};

C.Interface = new C.Interface();
