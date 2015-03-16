$('#citrongis').html('<div class="main"><div id="background-citrongis">CitronGIS<div class="loader"><div class="bar"></div><div class="info"></div></div></div></div>');



var it = 0;
var prefix = "http://192.168.1.7:8080/src/";
var files = [
    'lib/Long.js',
    'lib/jszip.js',
    'lib/proj4-src.js',
    'lib/ejs.js',
    'lib/EventEmitter.js',
    'lib/pixi.dev.js',
    'lib/lru-cache.js',
    'lib/async.js',
    'js/Utils/Comparison.js',
    'js/Utils/Intersection.js',
    'js/Utils/Inheritance.js',
    'js/Utils/Object.js',
    'js/Utils/Context.js',
    'js/Utils/Path.js',
    'js/Geometry/Point.js',
    'js/Geometry/Vector2.js',
    'js/Geometry/Vector3.js',
    'js/Geometry/BoundingBox.js',
    'js/Geometry/Extent.js',
    'js/System/Viewport.js',
    'js/Helpers/CoordinatesHelper.js',
    'js/Helpers/ProjectionsHelper.js',
    'js/Helpers/ResolutionHelper.js',
    'js/Extension/Require.js',
    'js/Extension/UI/include.js',
    'js/Extension/UI/trigger.js',
    'js/Extension/UI/Bridge.js',
    'js/Extension/UI/UI.js',
    'js/Extension/Module.js',
    'js/Extension/Extension.js',
    'js/Extension/Manager.js',
    'js/Geometry/LatLng.js',
    'js/Geo/Feature/Feature.js',
    'js/Geo/Feature/Circle.js',
    'js/Geo/Feature/Image.js',
    'js/Geo/Feature/Line.js',
    'js/Geo/Feature/Polygon.js',
    'js/Geo/Layer.js',
    'js/Layer/Tile/TileIndex.js',
    'js/Layer/Tile/TileSchema.js',
    'js/Layer/Tile/Schema/SphericalMercator.js',
    'js/Layer/Tile/Source/TileSource.js',
    'js/Layer/Tile/Source/TMSSource.js',
    'js/Layer/Tile/TileLayer.js',
    'js/Extension/LayerGroup.js',
    'js/Extension/LayerManager.js',
    'js/Extension/LayerHelper.js',
    'js/Schema/SchemaBase.js',
    'js/Schema/SphericalMercator.js',
    'js/System/Events.js',
    'js/CitronGISDebugger.js',
    'js/Renderer/RendererBase.js',
    'js/Renderer/PIXIRenderer.js',
    'js/CitronGIS.js'
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

    map.on('viewportMove', function (viewport) {

        //console.log('viewportMove');
    });
    map.on('viewportMoved', function (viewport) {

        //console.log('viewportMoved');
        //console.log(viewport._origin.toString());
        //console.log(viewport._bbox.toString());
    });
});

var fileInput = document.getElementById('file');

//

function fileChanged() {
    map.loadExtension(this.files[0]);
};

fileInput.onchange = fileChanged;
