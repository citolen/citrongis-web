$('#citrongis').html('<div class="main"><div id="background-citrongis">CitronGIS<div class="loader"><div class="bar"></div><div class="info"></div></div></div></div>');



var it = 0;
var prefix = "http://127.0.0.1:8080/";
var files = [
    'src/lib/Long.js',
    'src/lib/jszip.js',
    'src/lib/proj4-src.js',
    'src/lib/ejs.js',
    'src/lib/EventEmitter.js',
    'src/lib/pixi.js',
    'src/lib/lru-cache.js',
    'src/lib/async.js',
    'citrongis-core/src/index.js',
    'citrongis-core/src/utils/Comparison.js',
    'citrongis-core/src/utils/Intersection.js',
    'citrongis-core/src/utils/Inheritance.js',
    'citrongis-core/src/utils/Object.js',
    'citrongis-core/src/utils/Context.js',
    'citrongis-core/src/utils/Path.js',
    'citrongis-core/src/utils/Event.js',
    'citrongis-core/src/geometry/Point.js',
    'citrongis-core/src/geometry/Vector2.js',
    'citrongis-core/src/geometry/Vector3.js',
    'citrongis-core/src/geometry/BoundingBox.js',
    'citrongis-core/src/geometry/Extent.js',
    'citrongis-core/src/system/Viewport.js',
    'citrongis-core/src/helpers/CoordinatesHelper.js',
    'citrongis-core/src/helpers/ProjectionsHelper.js',
    'citrongis-core/src/helpers/IntersectionHelper.js',
    'citrongis-core/src/helpers/ResolutionHelper.js',
    'citrongis-core/src/helpers/RendererHelper.js',
    'citrongis-core/src/extension/URLHandler.js',
    'citrongis-core/src/extension/Require.js',
    'citrongis-core/src/extension/ui/Include.js',
    'citrongis-core/src/extension/ui/trigger.js',
    'citrongis-core/src/extension/ui/Bridge.js',
    'citrongis-core/src/extension/ui/UI.js',
    'citrongis-core/src/extension/Module.js',
    'citrongis-core/src/extension/Extension.js',
    'citrongis-core/src/extension/Manager.js',
    'citrongis-core/src/geometry/LatLng.js',
    'citrongis-core/src/geo/feature/Feature.js',
    'citrongis-core/src/geo/feature/Circle.js',
    'citrongis-core/src/geo/feature/Image.js',
    'citrongis-core/src/geo/feature/Line.js',
    'citrongis-core/src/geo/feature/Polygon.js',
    'citrongis-core/src/geo/Layer.js',
    'citrongis-core/src/layer/tile/TileIndex.js',
    'citrongis-core/src/layer/tile/TileSchema.js',
    'citrongis-core/src/layer/tile/Schema/SphericalMercator.js',
    'citrongis-core/src/layer/tile/Source/TileSource.js',
    'citrongis-core/src/layer/tile/Source/TMSSource.js',
    'citrongis-core/src/layer/tile/TileLayer.js',
    'citrongis-core/src/extension/LayerGroup.js',
    'citrongis-core/src/extension/LayerManager.js',
    'citrongis-core/src/extension/LayerHelper.js',
    'citrongis-core/src/schema/SchemaBase.js',
    'citrongis-core/src/schema/SphericalMercator.js',
    'citrongis-core/src/system/Events.js',
    'citrongis-core/src/system/TileSchemaManager.js',
    'src/js/CitronGISDebugger.js',
    'citrongis-core/src/renderer/RendererBase.js',
    'src/js/Renderer/PIXIRenderer.js',
    'citrongis-core/src/ui/PopupManager.js',
    'citrongis-core/src/ui/Popup.js',
    'src/js/CitronGIS.js'
];

var map;

(function loadnext(callback) {
    $('.loader .bar').width((it / files.length * 100) + '%');
    if (it === files.length) {
        $('.loader').fadeTo(400,0);
        callback();
        return;
    }
    var src = prefix + files[it++];
    $('.loader .info').html(src);
    var script = document.createElement('SCRIPT');
    script.onload = loadnext.bind(this, callback);
    script.src = src;
    document.body.appendChild(script);
})(function () {
    console.log('loading done');

    map = new C.CitrongGIS(document.getElementById('citrongis'));
});

//var fileInput = document.getElementById('file');
//
////
//
//function fileChanged() {
//    map.loadExtension(this.files[0]);
//};
//
//fileInput.onchange = fileChanged;
