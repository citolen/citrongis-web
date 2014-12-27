$('#citrongis').html('<div class="main"><div id="background-citrongis">CitronGIS<div class="loader"><div class="bar"></div><div class="info"></div></div></div></div>');



var it = 0;
var files = [
    'http://localhost:8080/lib/jszip.js',
    'http://localhost:8080/lib/proj4.js',
    'http://localhost:8080/lib/ejs.js',
    'http://localhost:8080/lib/EventEmitter.js',
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
    'http://localhost:8080/js/Helpers/CoordinatesHelper.js',
    'http://localhost:8080/js/Helpers/ProjectionsHelper.js',
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
    'http://localhost:8080/js/Extension/LayerGroup.js'
];

function loadfile(src) {
    $('.loader .info').html(src);
    var script = document.createElement('SCRIPT');
    script.onload = loadnext;
    script.src = src;
    document.body.appendChild(script);
}

function loadnext() {
    $('.loader .bar').width((it / files.length * 100) + '%');
    if (it === files.length) {
        $('.loader').fadeTo(400,0);
        return;
    }
    loadfile(files[it++]);
}

loadnext();

var fileInput = document.getElementById('file');

function fileChanged() {
    var reader = new FileReader();

    reader.onload = function() {
        var extZip = new JSZip();
        extZip.load(reader.result);

        var e = new C.Extension.Extension(extZip);
        C.Extension.Manager.register(e);
        debugPackage(e.package);

        e.module.ui.on('display', function (element) {
            var container = document.createElement('DIV');
            container.appendChild(element);
            container.className = "extension-container";
            document.body.appendChild(container);
            $(container).draggable({ containment: "#citrongis", scroll: false });
        });

        e.run();

        console.log(e.module.exports);
    };

    reader.readAsArrayBuffer(this.files[0]);
};

fileInput.onchange = fileChanged;


function debugPackage(package) {
    console.log("name:" + package.name);
    console.log("version:" + package.version);
    console.log("main:" + package.main);
}
