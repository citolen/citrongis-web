$('#citrongis').html('<div class="main"><div id="background-citrongis"><div class="loader"><div class="bar"></div><div class="info"></div></div></div></div>');



var it = 0;
var prefix = "../../";
var files = [
    'src/lib/jszip.min.js',
    'src/lib/pixi.js',
    'citrongis-core/lib/Long.min.js',
    'citrongis-core/lib/EventEmitter.min.js',
    'citrongis-core/lib/proj4.js',
    'citrongis-core/lib/lru-cache.js',
    'citrongis-core/lib/async.min.js',
    'citrongis-core/lib/dust-full.min.js',
    'citrongis-core/lib/less.min.js',
    'citrongis-core/src/index.js',
    'citrongis-core/src/utils/Comparison.js',
    'citrongis-core/src/utils/Intersection.js',
    'citrongis-core/src/utils/Inheritance.js',
    'citrongis-core/src/utils/Object.js',
    'citrongis-core/src/utils/Context.js',
    'citrongis-core/src/utils/Path.js',
    'citrongis-core/src/utils/Event.js',
    'citrongis-core/src/geometry/Point.js',
    'citrongis-core/src/geometry/Bounds.js',
    'citrongis-core/src/geometry/Vector2.js',
    'citrongis-core/src/geometry/Vector3.js',
    'citrongis-core/src/geometry/BoundingBox.js',
    'citrongis-core/src/geometry/Extent.js',
    'citrongis-core/src/geometry/Rectangle.js',
    'citrongis-core/src/system/Viewport.js',
    'citrongis-core/src/helpers/CoordinatesHelper.js',
    'citrongis-core/src/helpers/ProjectionsHelper.js',
    'citrongis-core/src/helpers/IntersectionHelper.js',
    'citrongis-core/src/helpers/ResolutionHelper.js',
    'citrongis-core/src/helpers/RendererHelper.js',
    'citrongis-core/src/extension/URLHandler.js',
    'citrongis-core/src/extension/API.js',
    'citrongis-core/src/extension/Require.js',
    'citrongis-core/src/extension/UI/Include.js',
    'citrongis-core/src/extension/UI/Trigger.js',
    'citrongis-core/src/extension/UI/Bridge.js',
    'citrongis-core/src/extension/UI/UI.js',
    'citrongis-core/src/extension/Module.js',
    'citrongis-core/src/extension/Storage.js',
    'citrongis-core/src/extension/ExtensionResources.js',
    'citrongis-core/src/extension/Extension.js',
    'citrongis-core/src/extension/Manager.js',
    'citrongis-core/src/geometry/LatLng.js',
    'citrongis-core/src/geo/Feature/Feature.js',
    'citrongis-core/src/geo/Feature/Circle.js',
    'citrongis-core/src/geo/Feature/Image.js',
    'citrongis-core/src/geo/Feature/Line.js',
    'citrongis-core/src/geo/Feature/Polygon.js',
    'citrongis-core/src/geo/Feature/Text.js',
    'citrongis-core/src/geo/Layer.js',
    'citrongis-core/src/geo/BoundedLayer.js',
    'citrongis-core/src/geo/FeatureGroup.js',
    'citrongis-core/src/layer/tile/TileIndex.js',
    'citrongis-core/src/layer/tile/TileSchema.js',
    'citrongis-core/src/layer/tile/schema/SphericalMercator.js',
    'citrongis-core/src/layer/tile/schema/SphericalMercatorRetina.js',
    'citrongis-core/src/layer/tile/source/TileSource.js',
    'citrongis-core/src/layer/tile/source/TMSSource.js',
    'citrongis-core/src/layer/tile/TileLayer.js',
    'citrongis-core/src/extension/LayerGroup.js',
    'citrongis-core/src/extension/LayerManager.js',
    'citrongis-core/src/extension/LayerHelper.js',
    'citrongis-core/src/schema/SchemaBase.js',
    'citrongis-core/src/schema/SphericalMercator.js',
    'src/js/system/MouseEvent.js',
    'src/js/system/Events.js',
    'citrongis-core/src/system/TileSchemaManager.js',
    'src/js/CitronGISDebugger.js',
    'citrongis-core/src/renderer/RendererBase.js',
    'src/js/Renderer/PIXIRenderer.js',
    'citrongis-core/src/ui/PopupManager.js',
    'citrongis-core/src/ui/Popup.js',
    'src/js/interface/interface.js',
    'src/js/interface/grid.js',
    'src/js/interface/block.js',
    'src/js/interface/buttonblock.js',
    'src/js/interface/windowblock.js',
    'src/js/interface/tilelayerblock.js',
    'src/js/interface/utilsLogin.js',
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
//    map.loadExtension(this.files[0], map);
//};
//
//fileInput.onchange = fileChanged;
