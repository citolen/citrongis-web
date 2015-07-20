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
    var scaleWidth = C.Helpers.viewport._width * 0.05;
    var w1 = C.Helpers.viewport.screenToWorld(C.Helpers.viewport._width - scaleWidth, 0);
    var w2 = C.Helpers.viewport.screenToWorld(C.Helpers.viewport._width, 0);

    w1 = new C.Geometry.Point(w1.X, w1.Y, w1.Z, C.Helpers.viewport._schema._crs);
    w2 = new C.Geometry.Point(w2.X, w2.Y, w2.Z, C.Helpers.viewport._schema._crs);



    w1 = C.Helpers.CoordinatesHelper.TransformTo(w1, C.Helpers.ProjectionsHelper.WGS84);
    w2 = C.Helpers.CoordinatesHelper.TransformTo(w2, C.Helpers.ProjectionsHelper.WGS84);
    //    var scaleM = C.Helpers.viewport._resolution * scaleWidth;
    var scaleM = distanceBetween2Points(w1, w2);

    if (scaleM > 1000) { //km scale

        scaleM = Math.floor(scaleM / 1000);
        var n = Math.pow(10, scaleM.toString().length-1);
        scaleM = Math.ceil(scaleM / n) * n;

        var barSize = Math.ceil(scaleM * 1000 / C.Helpers.viewport._resolution);
        $('.scale-val').html(scaleM + 'km');
        $('.scale-bar').width(barSize);

    } else { // m scale
        scaleM = Math.floor(scaleM);
        var n = Math.pow(10, scaleM.toString().length-1);
        scaleM = Math.ceil(scaleM / n) * n;
        var barSize = Math.ceil(scaleM / C.Helpers.viewport._resolution);
        $('.scale-val').html(scaleM + 'm');
        $('.scale-bar').width(barSize);
    }
}

this.onLoaded = function () {
    C.Helpers.viewport.on('resolutionChange', function () {
        updateUI();
    });
    updateUI();
};
