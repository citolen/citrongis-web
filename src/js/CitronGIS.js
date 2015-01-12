/*
**
**  CitronGIS.js
**
**  Author citolen
**  27/12/2014
**
*/

var C = C || {};

C.CitrongGIS = function (rootDIV) {

    'use strict';

    this._rootDiv = rootDIV;

    this._layerManager = new C.Extension.LayerManager();

    this._renderer = new PIXI.autoDetectRenderer($(this._rootDiv).width(), $(this._rootDiv).height(), {
        transparent: true
    });

    this._renderer.view.id = '__citrongisRenderer';
    this._rootDiv.appendChild(this._renderer.view);
    this._rendererStage = new PIXI.Stage(0x000000, 10);
    this._rendererStage.setQuadtreeSize(this._renderer.width, this._renderer.height);

    this._viewport = new C.System.Viewport({
        width: this._renderer.width,
        height: this._renderer.height,
        resolution: C.Helpers.ResolutionHelper.Resolutions[10],
        schema: new C.Schema.SphericalMercator(),
        origin: new C.Geometry.Vector2(0,0)
    });


    var self = this;
    $(window).resize(function () {
        var width = $(self._rootDiv).width();
        var height = $(self._rootDiv).height();
        self._renderer.resize(width, height);
        self._rendererStage.setQuadtreeSize(self._renderer.width, self._renderer.height);
        self._viewport.resize(width, height);
    });

    requestAnimFrame( animate );
    function animate() {
        requestAnimFrame( animate );
        self._renderer.render(self._rendererStage);
    }

    C.System.Events.attach(this);

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x0000FF);
    graphics.lineStyle(1, 0xFF0000);
    graphics.drawRect(0, 0, 300, 200);
    graphics.hitArea = new PIXI.Rectangle(0, 0, 300, 200);
    graphics.position = new PIXI.Point(500, 100);
    graphics.interactive = true;
    var d = false;
    graphics.mousedown = function () {
        d = true;
    };

    graphics.mousemove = function (evt, mouse) {
        if (!d) return;
        graphics.x = mouse.global.x - 100;
        graphics.y = mouse.global.y - 100;
        //console.log(mouse);
    };

    graphics.mouseup = function () {
        d = false;
    };


    this._rendererStage.addChild(graphics);
};

C.CitrongGIS.prototype.loadExtension = function (file) {

    'use strict';

    var self = this;
    var reader = new FileReader();

    reader.onload = function() {

        var extZip = new JSZip();
        extZip.load(reader.result);

        var e = new C.Extension.Extension(extZip, self._layerManager);
        C.Extension.Manager.register(e);

        e.module.ui.on('display', function (element) {
            var container = document.createElement('DIV');
            container.appendChild(element);
            container.className = "extension-container";

            self._rootDiv.appendChild(container);
            $(container).draggable({ containment: "#citrongis", scroll: false });
        });

        e.run();
    };

    reader.readAsArrayBuffer(file);
};
