/*
 *  interface.js    //TODO description
 */

var C = C || {};

C.Interface = function () {

    this._root;
    this._container;
    this._grid;

};

C.Interface.prototype.bindExtensionLauncher = function (button, extension, autostart) {
    var self = this;
    var loaded = false;
    var loading = false;
    var ext;

    function click() {
        if (!loaded) {
            loaded = true;
            loading = true;
            button.setContent('<i class="fa fa-spinner fa-spin"></i>');
            C.Extension.Extension_ctr.call({_map: self._map}, new URLHandler({
                baseUrl: './src/modules/' + extension + '/'
            }), function (err, ex) {
                if (err) {
                    console.error(err);
                }
                ext = ex;
                ext._module.ui.on('display', function () {
                    loading = false;
                    button.setContent(extension);
                });
                ext._module.ui.on('destroy', function () {
                    loaded = false;
                });
                ext.on('stopped', function () {
                    ga('send', 'pageview', extension + '/Destroy');
                });
            });
            ga('send', 'pageview', extension + '/Open');
        } else if (!loading) {
            ext.destroy();
        }
    }
    button.on('click', click);
    if (autostart) {
        click();
    }
};

C.Interface.prototype.init = function (root, map) {
    this._root = root;
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'citrongis-interface';
    this._root.appendChild(this._container);

    this._grid = new C.Interface.Grid(this._container);

    var layerButton = new C.Interface.ButtonBlock({
        x: 2,
        y: 1,
        width: 5,
        height: 1,
        float: C.Interface.BlockFloat.topRight,
        content: '<i class="fa fa-map-o"></i>&nbsp;Select map',
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
    layerWindow.addTileLayer('./img/preview_mapbox.jpg', 'Mapbox', 0);
    layerWindow.addTileLayer('./img/preview_satellite.jpg', 'Satellite', 1);
    layerWindow.addTileLayer('./img/preview_arcgis.jpg', 'Arcgis', 2);
    layerWindow.addTileLayer('./img/preview_osm.jpg', 'OpenStreetMap', 3);
    layerWindow.addTileLayer('./img/preview_stamen.jpg', 'Toner', 4);
    layerWindow.addTileLayer('./img/preview_google.jpg', 'Google', 5);
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

    var cssBarLeft = {
        borderRadius: '4px 0px 0px 4px',
        fontWeight: 'normal',
        fontSize: '15px',
        boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 3px -3px rgba(0,0,0,0.65)'
    };
    var cssBarMiddle = {
        borderRadius: '0px 0px 0px 0px',
        fontWeight: 'normal',
        fontSize: '15px',
        boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 3px -3px rgba(0,0,0,0.65)'
    };
    var cssBarRight = {
        borderRadius: '0px 4px 4px 0px',
        fontWeight: 'normal',
        fontSize: '15px',
        boxShadow: '0 2px 5px -2px rgba(0,0,0,0.65), 0 -1px 3px -3px rgba(0,0,0,0.65)'
    };

    var myLocationButton = new C.Interface.ButtonBlock({
        x: 1,
        y: 4,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '<i class="fa fa-location-arrow"></i>',
        css: {
            borderRadius: '4px',
            borderTop: 'none',
            fontSize: '16px'
        }
    });
    this._grid.addBlock(myLocationButton);

    /*
    ** Store Button
    */

    var blockStore = new C.Interface.ButtonBlock({
        x: 3,
        y: 1,
        width: 2,
        height: 2,
        float: C.Interface.BlockFloat.topLeft,
        content: '<img src="../../src/css/img/menu_bag.png" style="height: 75%"/>',
        css: {
            borderRadius: '4px 4px 4px 4px',
            borderBottom: 'solid 5px #2ecc71',
            fontWeight: 'bold',
            boxShadow: 'none'
        }
    });
    this._grid.addBlock(blockStore);

    /*
    ** Store Window
    */
    var windowStore = new C.Interface.WindowBlock({
        x: blockStore.getX(),
        y: blockStore.getY() + 2,
        width: 20,
        height: 20,
        float: C.Interface.BlockFloat.topLeft,
        content: '<store-citrongis></store-citrongis>',
        css: {
            borderRadius: '4px 4px 4px 4px',
            borderBottom: 'solid 5px #2ecc71',
            fontWeight: 'bold',
            boxShadow: 'none',
            display: 'none'
        }
    });
    this._grid.addBlock(windowStore);


    zoomInButton.on('click', function () {
        C.System.Events.zoomInWithAnimation();
    });
    zoomOutButton.on('click', function () {
        C.System.Events.zoomOutWithAnimation();
    });

    var myLocation;
    var myLocationDisplayed;
    myLocationButton.on('click', function () {
        if (!myLocationDisplayed) {
            C.System.Locator.getUserPosition(function (geocoord) {
                if (!geocoord) { return; }
                myLocationDisplayed = true;
                var location = new C.Geometry.LatLng(geocoord.coords.latitude, geocoord.coords.longitude);
                if (!myLocation) {
                    myLocation = new C.Geo.Feature.Circle({
                        location: location,
                        radius: 15,
                        color: 0x1CAADE,
                        outlineColor: 0x259FC5,
                        outlineWidth: 0
                    });
                } else {
                    myLocation.location(location);
                }
                myLocationButton.setCSS('color', '#1CAADE');
                layer.add(myLocation);
                var bounds = new C.Geometry.Bounds(location);
                C.System.Events.zoomToBounds(bounds);
            });
        } else {
            myLocationDisplayed = false;
            myLocationButton.setCSS('color', 'black');
            layer.remove(myLocation);
        }
    });
    blockStore.on('click', function () {
        if (windowStore.isVisible() == false) {
            blockStore.setCSS('backgroundColor', '#2ecc71');
            windowStore.setCSS('display', 'block');
        }
        else {
            blockStore.setCSS('backgroundColor', '');
            windowStore.setCSS('display', 'none');
        }
    });
};

C.Interface.prototype.resize = function (width, height) {

    this._grid.resize(width, height);

};

C.Interface = new C.Interface();
