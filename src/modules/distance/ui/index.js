var measuring = false;
var aire = false;

var group = C.LayerGroup({
    name: 'distance-group'
});

var lineLayer = C.Layer();
var baseLayer = C.Layer();

lineLayer.addTo(group);
baseLayer.addTo(group);

var distanceDot = C.Circle({
    radius: 5,
    location: C.LatLng(0, 0),
    opacity: 0,
    outlineColor: 0xF2676B,
    backgroundColor: 0xffffff,
    outlineWidth: 3
});

distanceDot.addTo(baseLayer);

var measurePoints = [];
var measureLines = [];


this.onLoaded = function () {
    E.$('.cat').click(function (e) {
        if (e.currentTarget.id == 'aire' &&  !aire) {
            aire = true;
            E.$('#aire i').addClass('fa-check-square-o');
            E.$('#aire i').removeClass('fa-square-o');
            E.$('#distance i').addClass('fa-square-o');
            E.$('#distance i').removeClass('fa-check-square-o');
            reset();
        }
        if (e.currentTarget.id == 'distance' && aire) {
            aire = false;
            E.$('#aire i').addClass('fa-square-o');
            E.$('#aire i').removeClass('fa-check-square-o');
            E.$('#distance i').addClass('fa-check-square-o');
            E.$('#distance i').removeClass('fa-square-o');
            reset();
        }
    });

    E.$('.measure').click(function () {
        if (!measuring) {
            reset();
            E.$('.measure').text('terminer la mesure');
            measuring = true;
        } else {
            reset()
            E.$('.measure').text('mesurer');
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
        E.$('.info').text('0 m²');
    } else {
        E.$('.info').text('0 m');
    }
}

function setEvent(toggle) {
    if (toggle) {
        C.Events.on('mapClicked', mapClicked);
        C.Events.on('mouseMove', mouseMove);
        distanceDot.opacity(1);
    } else {
        C.Events.off('mapClicked', mapClicked);
        C.Events.off('mouseMove', mouseMove);
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

    var x = evt.offsetX;
    var y = evt.offsetY;

    var world = C.Viewport.screenToWorld(x, y);

    var measurePoint = C.Circle({
        radius: 5,
        location: C.Point(world.X, world.Y, 0, C.Viewport._schema._crs),
        outlineColor: 0xBF4E6C,
        backgroundColor: 0xffffff,
        outlineWidth: 3
    });

    measurePoints.push(measurePoint);
    measurePoint.addTo(baseLayer);

    if (measurePoints.length > 1) {

        if (!aire) {
            var measureLine = C.Line({
                locations: [
                    measurePoints[measurePoints.length-2].location(),
                    measurePoints[measurePoints.length-1].location()
                ],
                lineColor: 0xBF4E6C,
                lineWidth: 8
            });
            var measureLineInner = C.Line({
                locations: [
                    measurePoints[measurePoints.length-2].location(),
                    measurePoints[measurePoints.length-1].location()
                ],
                lineColor: 0xffffff,
                lineWidth: 4
            });

            measureLines.push(measureLine);
            measureLines.push(measureLineInner);
            measureLine.addTo(lineLayer);
            measureLineInner.addTo(lineLayer);
        } else if (aire && measurePoints.length > 2) {

            var points = [];
            for (var i = 0; i < measurePoints.length; ++i) {
                points.push(measurePoints[i].location());
            }

            var polygon = C.Polygon({
                locations: points,
                fillColor: 0xF2676B,
                outlineWidth: 3,
                outlineColor: 0xBF4E6C,
                opacity: 0.5
            });

            lineLayer.clearLayer();
            polygon.addTo(lineLayer);
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
    E.$('.info').text((val + units).replace('.', ', '));
}

function mouseMove(evt) {
    var x = evt.offsetX;
    var y = evt.offsetY;

    var world = C.Viewport.screenToWorld(x, y);

    distanceDot.location(C.Point(world.X, world.Y, 0, C.Viewport._schema._crs));
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

            p1 = C.CoordinatesHelper.TransformTo(p1, C.ProjectionsHelper.WGS84);
            p2 = C.CoordinatesHelper.TransformTo(p2, C.ProjectionsHelper.WGS84);
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

        prev = C.CoordinatesHelper.TransformTo(prev, C.ProjectionsHelper.WGS84);
        cur = C.CoordinatesHelper.TransformTo(cur, C.ProjectionsHelper.WGS84);

        dist += distanceBetween2Points(prev, cur);
    }

    return dist;
}
