function updateUI() {
    var scaleWidth = C.Helpers.viewport._width * 0.05;
    var scaleM = C.Helpers.viewport._resolution * scaleWidth;

    if (scaleM > 1000) { //km scale

        scaleM = Math.floor(scaleM / 1000);
        var n = Math.pow(10, scaleM.toString().length-1);
        scaleM = Math.ceil(scaleM / n) * n;

        var barSize = Math.ceil(scaleM * 1000 / C.Helpers.viewport._resolution);
        $('.scale-val').html(scaleM + ' km');
        $('.scale-bar').width(barSize);

    } else { // m scale
        scaleM = Math.floor(scaleM);
        var n = Math.pow(10, scaleM.toString().length-1);
        scaleM = Math.ceil(scaleM / n) * n;
        var barSize = Math.ceil(scaleM / C.Helpers.viewport._resolution);
        $('.scale-val').html(scaleM + ' m');
        $('.scale-bar').width(barSize);
    }
}

this.onLoaded = function () {
    C.Helpers.viewport.on('resolutionChange', function () {
        updateUI();
    });
    updateUI();
};
