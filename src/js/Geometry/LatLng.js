/*
**
**  LatLng.js
**
**  Author citolen
**  Created 24/12/2014
**
*/

var C = C || {};
C.Geometry = C.Geometry || {};

C.Geometry.LatLng = C.Utils.Inherit(function (base, y, x) {

    'use strict';

    base(x, y, undefined, C.Helpers.ProjectionsHelper.WGS84);

}, C.Geometry.Point, 'C.Geometry.LatLng');
