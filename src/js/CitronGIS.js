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

    C.Helpers.layermanager = this._layerManager = new C.Extension.LayerManager();

    this._renderer = new PIXI.CanvasRenderer($(this._rootDiv).width(), $(this._rootDiv).height(), {
        backgroundColor: 0xffffff
        //        transparent: true,
        //        antialias: true
    });


    this._renderer.view.id = '__citrongisRenderer';
    this._rootDiv.appendChild(this._renderer.view);

    $(this._renderer.view).on('contextmenu', this._rootDiv, function(e){ return false; });

    this._rendererStage = new PIXI.Container();

    this._viewport = new C.System.Viewport({
        width: this._renderer.width,
        height: this._renderer.height,
        resolution: C.Helpers.ResolutionHelper.Resolutions[3],
        schema: new C.Schema.SphericalMercator(),
        origin: C.Helpers.CoordinatesHelper.TransformTo(new C.Geometry.LatLng(0, 0), C.Helpers.ProjectionsHelper.EPSG3857),
        rotation: 0 * Math.PI / 180
    });
    C.Helpers.viewport = this._viewport;
    C.Helpers.schema = this._viewport._schema;
    C.Helpers.renderer = this._renderer;

    C.UI.PopupManager.init(this._rootDiv);
    this._extDiv = C.Extension.Extension.init(this._rootDiv);


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
    setTimeout(resize, 100);

    C.System.Events.attach(this);
    C.System.isMobile = false;

    C.Utils.Event.__initialized();

    C.Helpers.customRenderer = this._customRenderer = new C.Renderer.PIXIRenderer(this);

    $(document).ready(function () {
        C.Interface.init(self._rootDiv, self);
        C.CitrongGISDebug(self);
    });

    requestAnimationFrame( animate );
    function animate() {
        requestAnimationFrame( animate );
        self._customRenderer.renderFrame();
        C.System.Events.renderFrame();
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

//(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();stats.domElement.style.cssText='position:fixed;left:0;top:0;z-index:10000';document.body.appendChild(stats.domElement);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()
