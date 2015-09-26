/*
**
**  CitronGIS.js
**
**  Author citolen
**  27/12/2014
**
*/

var C = C || {};

C.CitrongGIS = C.Utils.Inherit(function (base, rootDIV) {

    'use strict';

    //<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css';
    $('head').append(link);

    this._rootDiv = rootDIV;

    //    $('body').on('contextmenu', this._rootDiv, function(e){ return false; });

    C.Helpers.layermanager = this._layerManager = new C.Extension.LayerManager();

    this._renderer = new PIXI.CanvasRenderer($(this._rootDiv).width(), $(this._rootDiv).height(), {
        transparent: true,
        antialias: true
    });


    this._renderer.view.id = '__citrongisRenderer';
    this._rootDiv.appendChild(this._renderer.view);

    this._rendererStage = new PIXI.Container();
    //    this._rendererStage.setQuadtreeSize(this._renderer.width, this._renderer.height);

    this._viewport = new C.System.Viewport({
        width: this._renderer.width,
        height: this._renderer.height,
        resolution: C.Helpers.ResolutionHelper.Resolutions[6],
        schema: new C.Schema.SphericalMercator(),
        origin: C.Helpers.CoordinatesHelper.TransformTo(new C.Geometry.LatLng(48.8156, 2.362886), C.Helpers.ProjectionsHelper.EPSG3857),
        rotation: 0 * Math.PI / 180
    });
    C.Helpers.viewport = this._viewport;
    C.Helpers.schema = this._viewport._schema;

    C.UI.PopupManager.init(this._rootDiv);
    this._extDiv = C.Extension.Extension.init(this._rootDiv);

    C.Interface.init(this._rootDiv);

    var self = this;

    function resize() {
        var width = $(self._rootDiv).width();
        var height = $(self._rootDiv).height();
        self._renderer.resize(width, height);
        self._viewport.resize(width, height);
        C.UI.PopupManager.resize(width, height);
        C.Interface.resize(width, height);
    }

    $(window).resize(resize);

    C.System.Events.attach(this);

    C.Utils.Event.__initialized();

    this._customRenderer = new C.Renderer.PIXIRenderer(this);
    C.CitrongGISDebug(this);

    requestAnimationFrame( animate );
    function animate() {
        requestAnimationFrame( animate );
        self._customRenderer.renderFrame();
        self._renderer.render(self._rendererStage);
    }
}, EventEmitter, 'C.CitronGIS');

//TODO FIX repeat code from citronGISDebugger
C.CitrongGIS.prototype.loadExtension = function (file, citronGIS) {

    'use strict';

    var self = this;
    var reader = new FileReader();

    reader.onload = function() {

        var extZip = new JSZip();
        extZip.load(reader.result);

        new C.Extension.Extension(extZip, citronGIS._layerManager, function (err, extension) {

            if (err) {
                return console.log(err);
            }

            C.Extension.Manager.register(extension);

            extension._module.ui.on('display', function (element, nowindow) {

                citronGIS._extDiv.appendChild(element);

                if (!nowindow) {
                    $(element).draggable({
                        containment: "#citrongis",
                        scroll: false,
                        handle: '.citrongisextension-header'
                    });
                }
            });

            extension.run();
        });

//        var e = new C.Extension.Extension(extZip, self._layerManager);
//        C.Extension.Manager.register(e);
//
//        e.module.ui.on('display', function (element) {
//            var container = document.createElement('DIV');
//            container.appendChild(element);
//            container.className = "extension-container";
//
//            self._extDiv.appendChild(container);
//            $(container).draggable({ containment: "#citrongis", scroll: false });
//        });
//
//        e.run();
    };

    reader.readAsArrayBuffer(file);
};
