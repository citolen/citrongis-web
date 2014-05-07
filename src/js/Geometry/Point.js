/*
 * Author citole_n
 * Created 06/05/2014
 *
 *
 */

var C = C || {};

C.Geometry = C.Geometry || {};

C.Geometry.Point = function (x, y, z, crs) {
    "use strict";

    /* X */
    this.X = x || 0;

    /* Y */
    this.Y = y || 0;

    /* Z */
    this.Z = z || 0;

    /* Coordinate Reference System */
    this.CRS = C.Helpers.CoordinatesHelper.CheckProj(crs);
};

/*
 * Pretty print
 */
C.Geometry.Point.prototype.toString = function () {
    "use strict";
    return ("{ x: " + this.X + ", y: " + this.Y + ", z: " + this.Z + ", CRS: " + (this.CRS.name || this.CRS.title || this.CRS) + "}");
};

/*
 * Transform this point to the projection to
 */
C.Geometry.Point.prototype.Transform = function (to) {
    "use strict";
    var tmp = C.Helpers.CoordinatesHelper.Transform(this, to);
    this.X = tmp.X;
    this.Y = tmp.Y;
    this.Z = tmp.Z;
    this.CRS = tmp.CRS;
};
