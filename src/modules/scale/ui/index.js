function distanceBetween2Points(p1, p2) {
    var R = 6371000;
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

function updateUI() {
    var scaleWidth = C.Viewport._width * 0.05;
    var w1 = C.Viewport.screenToWorld(C.Viewport._width - scaleWidth, 0);
    var w2 = C.Viewport.screenToWorld(C.Viewport._width, 0);

    w1 = C.Point(w1.X, w1.Y, w1.Z, C.Viewport._schema._crs);
    w2 = C.Point(w2.X, w2.Y, w2.Z, C.Viewport._schema._crs);

    w1 = C.CoordinatesHelper.TransformTo(w1, C.ProjectionsHelper.WGS84);
    w2 = C.CoordinatesHelper.TransformTo(w2, C.ProjectionsHelper.WGS84);

    var scaleM = distanceBetween2Points(w1, w2);

    if (scaleM > 1000) { //km scale

        scaleM /= 1000;
        var roundedScale = Math.floor(scaleM);
        var n = Math.pow(10, roundedScale.toString().length-1);
        var roundedScale = Math.ceil(roundedScale / n) * n;
        E.$('.val').html(roundedScale + 'km');
        E.$('.bar').width(scaleWidth * roundedScale / scaleM);

    } else { // m scale
        scaleM = Math.floor(scaleM);
        var n = Math.pow(10, scaleM.toString().length-1);
        scaleM = Math.ceil(scaleM / n) * n;
        var barSize = Math.ceil(scaleM / C.Viewport._resolution);
        E.$('.val').html(scaleM + 'm');
        E.$('.bar').width(barSize);
    }
}

this.onLoaded = function () {
    C.Viewport.on('resolutionChange', function () {
        updateUI();
    });
    updateUI();
};
