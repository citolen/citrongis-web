var measuring = false;
var group = module.layerHelper.createGroup({
    name: 'Invisible_distance_ui'
});

var lineLayer = new C.Geo.Layer({

});

var baseLayer = new C.Geo.Layer({

});

group.addLayer(lineLayer);
group.addLayer(baseLayer);

var distanceDot = new C.Geo.Feature.Circle({
    radius: 5,
    location: new C.Geometry.LatLng(0, 0),
    opacity: 0,
    outlineColor: 0x3498db,
    backgroundColor: 0xffffff,
    outlineWidth: 3
});

baseLayer.addFeature(distanceDot);

var measurePoints = [];
var measureLines = [];

this.onLoaded = function () {

    $('.content', '.distance-ui').click(function () {

        if (!measuring) {

            $('.text', '.distance-ui').text('0 m');
            $('.content', '.distance-ui').addClass('processing');
            measuring = true;

        } else {

            $('.text', '.distance-ui').text('start measuring');
            $('.content', '.distance-ui').removeClass('processing');
            measuring = false;
            emptyLayers();
        }

        setEvent(measuring);

    });

};

function setEvent(toggle) {
    if (toggle) {
        C.System.Events.on('mapClicked', mapClicked);
        C.System.Events.on('mouseMove', mouseMove);
        distanceDot.opacity(1);
    } else {
        C.System.Events.off('mapClicked', mapClicked);
        C.System.Events.off('mouseMove', mouseMove);
        distanceDot.opacity(0);
    }
}

function emptyLayers() {
    for (var i = 0; i < measurePoints.length; ++i) {
        baseLayer.removeFeature(measurePoints[i]);
    }
    for (var i = 0; i < measureLines.length; ++i) {
        lineLayer.removeFeature(measureLines[i]);
    }

    measurePoints = [];
    measureLines = [];
}

function mapClicked(evt) {

    var x = evt.clientX;
    var y = evt.clientY;

    var world = C.Helpers.viewport.screenToWorld(x, y);

    var measurePoint = new C.Geo.Feature.Circle({
        radius: 5,
        location: new C.Geometry.Point(world.X, world.Y, 0, C.Helpers.viewport._schema._crs),
        outlineColor: 0x3498db,
        backgroundColor: 0xffffff,
        outlineWidth: 3
    });

    measurePoints.push(measurePoint);
    baseLayer.addFeature(measurePoint);

    if (measurePoints.length > 1) {

        var measureLine = new C.Geo.Feature.Line({
            locations: [
                measurePoints[measurePoints.length-2].location(),
                measurePoints[measurePoints.length-1].location()
            ],
            lineColor: 0x3498db,
            lineWidth: 4
        });

        measureLines.push(measureLine);
        lineLayer.addFeature(measureLine);
    }

    var dist = calculateDistance();
    var units = ' m';

    if (dist > 10000) {
        units = ' km';
        dist = Math.floor(dist / 10) / 100;
    } else {
        dist = Math.floor(dist);
    }
    $('.text', '.distance-ui').text(dist + units);
}

function mouseMove(evt) {
    var x = evt.clientX;
    var y = evt.clientY;

    var world = C.Helpers.viewport.screenToWorld(x, y);

    distanceDot.location(new C.Geometry.Point(world.X, world.Y, 0, C.Helpers.viewport._schema._crs));
}

function distanceBetween2Points(p1, p2) {
    var R = 6371000; // km
    var dLat = (p2.Y-p1.Y) * Math.PI / 180;
    var dLon = (p2.X-p1.X) * Math.PI / 180;
    var lat1 = (p1.Y) * Math.PI / 180;
    var lat2 = (p2.Y) * Math.PI / 180;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function calculateDistance() {

    var dist = 0;

    for (var i = 1; i < measurePoints.length; ++i) {
        var prev = measurePoints[i-1].location();
        var cur = measurePoints[i].location();

        prev = C.Helpers.CoordinatesHelper.TransformTo(prev, C.Helpers.ProjectionsHelper.WGS84);
        cur = C.Helpers.CoordinatesHelper.TransformTo(cur, C.Helpers.ProjectionsHelper.WGS84);

        dist += distanceBetween2Points(prev, cur);
    }

    return dist;
}
