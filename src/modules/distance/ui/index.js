var measuring = false;
var aire = false;
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
    outlineColor: 0xF2676B,
    backgroundColor: 0xffffff,
    outlineWidth: 3
});

baseLayer.addFeature(distanceDot);

var measurePoints = [];
var measureLines = [];

this.onLoaded = function () {

    $('.distance-ui-cat').click(function (e) {
        if (e.currentTarget.id == 'distance-ui-aire' &&  !aire) {
            aire = true;
            $('i', '#distance-ui-aire').addClass('fa-check-square-o');
            $('i', '#distance-ui-aire').removeClass('fa-square-o');
            $('i', '#distance-ui-distance').addClass('fa-square-o');
            $('i', '#distance-ui-distance').removeClass('fa-check-square-o');
            reset();
        }
        if (e.currentTarget.id == 'distance-ui-distance' && aire) {

            aire = false;
            $('i', '#distance-ui-aire').addClass('fa-square-o');
            $('i', '#distance-ui-aire').removeClass('fa-check-square-o');
            $('i', '#distance-ui-distance').addClass('fa-check-square-o');
            $('i', '#distance-ui-distance').removeClass('fa-square-o');
            reset();
        }
    });

    $('.distance-ui-measure').click(function () {

        if (!measuring) {

            reset();
            $('.distance-ui-measure').text('terminer la mesure');
            measuring = true;

        } else {
            reset()
            $('.distance-ui-measure').text('mesurer');
            measuring = false;
            emptyLayers();
        }

        setEvent(measuring);

    });

    reset();
};

function reset() {
    emptyLayers();
    if (aire) {
        $('.distance-ui-info').text('0 m²');
    } else {
        $('.distance-ui-info').text('0 m');
    }
}

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
    lineLayer.clearLayer();
    for (var i = 0; i < measurePoints.length; ++i) {
        baseLayer.removeFeature(measurePoints[i]);
    }
    //    for (var i = 0; i < measureLines.length; ++i) {
    //        lineLayer.removeFeature(measureLines[i]);
    //    }

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
        outlineColor: 0xBF4E6C,
        backgroundColor: 0xffffff,
        outlineWidth: 3
    });

    measurePoints.push(measurePoint);
    baseLayer.addFeature(measurePoint);

    if (measurePoints.length > 1) {

        if (!aire) {
            var measureLine = new C.Geo.Feature.Line({
                locations: [
                    measurePoints[measurePoints.length-2].location(),
                    measurePoints[measurePoints.length-1].location()
                ],
                lineColor: 0xBF4E6C,
                lineWidth: 8
            });
            var measureLineInner = new C.Geo.Feature.Line({
                locations: [
                    measurePoints[measurePoints.length-2].location(),
                    measurePoints[measurePoints.length-1].location()
                ],
                lineColor: 0xffffff,
                lineWidth: 4
            });

            measureLines.push(measureLine);
            measureLines.push(measureLineInner);
            lineLayer.addFeature(measureLine);
            lineLayer.addFeature(measureLineInner);
        } else if (aire && measurePoints.length > 2) {

            var points = [];
            for (var i = 0; i < measurePoints.length; ++i) {
                points.push(measurePoints[i].location());
            }

            var polygon = new C.Geo.Feature.Polygon({
                locations: points,
                fillColor: 0xF2676B,
                outlineWidth: 3,
                outlineColor: 0xBF4E6C,
                opacity: 0.5
            });

            lineLayer.clearLayer();
            lineLayer.addFeature(polygon);

        }
    }

    var val;
    var units = ' m';
    if (!aire) {
        val = calculateDistance();
    } else {
        val = calculateArea();
        units = ' m²';
    }


    if (!aire && val > 10000) {
        units = ' km';
        val = Math.floor(val / 10) / 100;
    } else if (aire && val > 10000) {
        units = ' km²';
        val = Math.floor((Math.floor(val) / 1000000) * 100) / 100;
    } else {
        val = Math.floor(val);
    }
    $('.distance-ui-info').text((val + units).replace('.', ', '));
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

function calculateArea() {

    var pointsCount = measurePoints.length,
        area = 0.0,
        d2r = Math.PI / 180.0,
        p1, p2;

    if (pointsCount > 2) {
        for (var i = 0; i < pointsCount; i++) {
            p1 = measurePoints[i].location();
            p2 = measurePoints[(i + 1) % pointsCount].location();

            p1 = C.Helpers.CoordinatesHelper.TransformTo(p1, C.Helpers.ProjectionsHelper.WGS84);
            p2 = C.Helpers.CoordinatesHelper.TransformTo(p2, C.Helpers.ProjectionsHelper.WGS84);
            area += ((p2.X - p1.X) * d2r) *
                (2 + Math.sin(p1.Y * d2r) + Math.sin(p2.Y * d2r));
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area);
}

function calculateDistance() {

    var dist = 0;

    for (var i = 1; i < measurePoints.length; ++i) {
        var prev = measurePoints[i-1].location();
        var cur = measurePoints[i].location();

//        dist += Math.sqrt(Math.pow((cur.X - prev.X), 2) + Math.pow((cur.Y - prev.Y), 2));

        prev = C.Helpers.CoordinatesHelper.TransformTo(prev, C.Helpers.ProjectionsHelper.WGS84);
        cur = C.Helpers.CoordinatesHelper.TransformTo(cur, C.Helpers.ProjectionsHelper.WGS84);

        dist += distanceBetween2Points(prev, cur);
    }

    return dist;
}
