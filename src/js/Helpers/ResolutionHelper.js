/*
**
**  ResolutionHelper.js
**
**  Author citolen
**  30/12/2014
**
*/

var C = C || {};
C.Helpers = C.Helpers || {};

C.Helpers.ResolutionHelper = {};

C.Helpers.ResolutionHelper._resolutionReference = 156543.033900000;

C.Helpers.ResolutionHelper.resolutionForZoom = function (zoomLevel) {

    'use strict';
    if (!zoomLevel) return (C.Helpers.ResolutionHelper._resolutionReference);

    return (C.Helpers.ResolutionHelper._resolutionReference / Math.pow(2, zoomLevel));
};

C.Helpers.ResolutionHelper.getZoomLevel = function (resolution) {

    'use strict';

    for (var i = 0; i < C.Helpers.ResolutionHelper.Resolutions.length; ++i) {
        var res = C.Helpers.ResolutionHelper.Resolutions[i];
        if (resolution > res || C.Utils.Comparison.Equals(resolution, res))
            return (i);
    }
    return (C.Helpers.ResolutionHelper.Resolutions.length - 1);
};

C.Helpers.ResolutionHelper.Resolutions = [
    C.Helpers.ResolutionHelper._resolutionReference,
    C.Helpers.ResolutionHelper.resolutionForZoom(1),
    C.Helpers.ResolutionHelper.resolutionForZoom(2),
    C.Helpers.ResolutionHelper.resolutionForZoom(3),
    C.Helpers.ResolutionHelper.resolutionForZoom(4),
    C.Helpers.ResolutionHelper.resolutionForZoom(5),
    C.Helpers.ResolutionHelper.resolutionForZoom(6),
    C.Helpers.ResolutionHelper.resolutionForZoom(7),
    C.Helpers.ResolutionHelper.resolutionForZoom(8),
    C.Helpers.ResolutionHelper.resolutionForZoom(9),
    C.Helpers.ResolutionHelper.resolutionForZoom(10),
    C.Helpers.ResolutionHelper.resolutionForZoom(11),
    C.Helpers.ResolutionHelper.resolutionForZoom(12),
    C.Helpers.ResolutionHelper.resolutionForZoom(13),
    C.Helpers.ResolutionHelper.resolutionForZoom(14),
    C.Helpers.ResolutionHelper.resolutionForZoom(15),
    C.Helpers.ResolutionHelper.resolutionForZoom(16),
    C.Helpers.ResolutionHelper.resolutionForZoom(17),
    C.Helpers.ResolutionHelper.resolutionForZoom(18),
    C.Helpers.ResolutionHelper.resolutionForZoom(19),
    C.Helpers.ResolutionHelper.resolutionForZoom(20),
    C.Helpers.ResolutionHelper.resolutionForZoom(21)
];
