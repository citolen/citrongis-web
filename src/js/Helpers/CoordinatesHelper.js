/*
 * Author citole_n
 * Created 06/05/2014
 */

var C = C || {};
var proj4 = proj4 || {};
var Proj4 = Proj4 || {};

C.Helpers = C.Helpers || {};

C.Helpers.CoordinatesHelper = {};

C.Helpers.CoordinatesHelper.Transform = function (point, to) {
    "use strict";
    var tmp = proj4(point.CRS, to, [point.X, point.Y]);
    return (new C.Geometry.Point(tmp[0], tmp[1], point.Z, C.Helpers.CoordinatesHelper.CheckProj(to)));
};

/*
 * Return a valid projection
 */
C.Helpers.CoordinatesHelper.CheckProj = function (item) {
    "use strict";
    if (item === undefined) {
        return (item);
    } else if (item instanceof proj4.Proj) {
        return (item);
    } else if (item.oProj) {
        return (item.oProj);
    }
    return (proj4.Proj(item));
};
