/*
**
**  Extent.js
**
**  Author citolen
**  11/01/2015
**
*/

var C = C || {};
C.Geometry = C.Geometry || {};

C.Geometry.Extent = function (minX, minY, maxX, maxY) {

    'use strict';

    this._minX = minX;

    this._minY = minY;

    this._maxX = maxX;

    this._maxY = maxY;
};
