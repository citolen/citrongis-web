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

C.Geometry.LatLng = C.Utils.Inherit(function (base, y, x, crs) {

    'use strict';

    base(x, y, undefined, crs);

}, C.Geometry.Point, 'C.Geometry.LatLng');
