$('#citrongis').html('<div class="main"><div id="background-citrongis">CitronGIS<div class="loader"><div class="bar"></div><div class="info"></div></div></div></div>');



var it = 0;
var files = [
    'http://localhost:8080/lib/jszip.js',
    'http://localhost:8080/lib/proj4.js',
    'http://localhost:8080/lib/ejs.js',
    'http://localhost:8080/lib/EventEmitter.js',
    'http://localhost:8080/lib/pixi.dev.js',
    'http://localhost:8080/js/Utils/Comparison.js',
    'http://localhost:8080/js/Utils/Intersection.js',
    'http://localhost:8080/js/Utils/Inheritance.js',
    'http://localhost:8080/js/Utils/Object.js',
    'http://localhost:8080/js/Utils/Context.js',
    'http://localhost:8080/js/Utils/Path.js',
    'http://localhost:8080/js/Geometry/Point.js',
    'http://localhost:8080/js/Geometry/Vector2.js',
    'http://localhost:8080/js/Geometry/Vector3.js',
    'http://localhost:8080/js/Geometry/BoundingBox.js',
    'http://localhost:8080/js/Geometry/Extent.js',
    'http://localhost:8080/js/System/Viewport.js',
    'http://localhost:8080/js/Helpers/CoordinatesHelper.js',
    'http://localhost:8080/js/Helpers/ProjectionsHelper.js',
    'http://localhost:8080/js/Helpers/ResolutionHelper.js',
    'http://localhost:8080/js/Extension/Require.js',
    'http://localhost:8080/js/Extension/UI/include.js',
    'http://localhost:8080/js/Extension/UI/trigger.js',
    'http://localhost:8080/js/Extension/UI/Bridge.js',
    'http://localhost:8080/js/Extension/UI/UI.js',
    'http://localhost:8080/js/Extension/Module.js',
    'http://localhost:8080/js/Extension/Extension.js',
    'http://localhost:8080/js/Extension/Manager.js',
    'http://localhost:8080/js/Geometry/LatLng.js',
    'http://localhost:8080/js/Geo/Feature/Feature.js',
    'http://localhost:8080/js/Geo/Feature/Circle.js',
    'http://localhost:8080/js/Geo/Feature/Image.js',
    'http://localhost:8080/js/Geo/Feature/Line.js',
    'http://localhost:8080/js/Geo/Feature/Polygon.js',
    'http://localhost:8080/js/Geo/Layer.js',
    'http://localhost:8080/js/Extension/LayerGroup.js',
    'http://localhost:8080/js/Extension/LayerManager.js',
    'http://localhost:8080/js/Extension/LayerHelper.js',
    'http://localhost:8080/js/Schema/SchemaBase.js',
    'http://localhost:8080/js/Schema/SphericalMercator.js',
    'http://localhost:8080/js/System/Events.js',
    'http://localhost:8080/js/CitronGISDebugger.js',
    'http://localhost:8080/js/Renderer/RendererBase.js',
    'http://localhost:8080/js/Renderer/PIXIRenderer.js',
    'http://localhost:8080/js/CitronGIS.js'
];

var map;

(function loadnext(callback) {
    $('.loader .bar').width((it / files.length * 100) + '%');
    if (it === files.length) {
        $('.loader').fadeTo(400,0);
        callback();
        return;
    }
    var src = files[it++];
    $('.loader .info').html(src);
    var script = document.createElement('SCRIPT');
    script.onload = loadnext.bind(this, callback);
    script.src = src;
    document.body.appendChild(script);
})(function () {
    console.log('loading done');

    map = new C.CitrongGIS(document.getElementById('citrongis'));

    map.on('viewportMove', function (viewport) {

        console.log('viewportMove');
    });
    map.on('viewportMoved', function (viewport) {

        console.log('viewportMoved');
        console.log(viewport._origin.toString());
        console.log(viewport._bbox.toString());
    });
});

var fileInput = document.getElementById('file');

//

function fileChanged() {
    map.loadExtension(this.files[0]);
};

fileInput.onchange = fileChanged;
