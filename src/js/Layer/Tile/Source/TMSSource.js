/*
**
**  TMSSource.js
**
**  Author citolen
**  01/03/2015
**
*/

var C = C || {};
C.Layer = C.Layer || {};
C.Layer.Tile = C.Layer.Tile || {};
C.Layer.Tile.Source = C.Layer.Tile.Source || {};

C.Layer.Tile.Source.TMSSource = C.Utils.Inherit(function (base, options) {

    // eg: {server}.example.org/{x}/{y}/{z}.png
    this._sourceUrl = options.url;

    // eg: [a, b, c]
    this._sourceServer = options.server;

    this._serverIdx = 0;

}, C.Layer.Tile.Source.TileSource, 'C.Layer.Tile.Source.TMSSource');

C.Layer.Tile.Source.TileSource.prototype.tileIndexToUrl = function (tileIndex) {

    'use strict';

    var url =   this._sourceUrl.replace('{x}', tileIndex._x);
    url =       url.replace('{y}', tileIndex._y);
    url =       url.replace('{z}', tileIndex._z);

    if (this._sourceServer) {
        url = url.replace('{server}', this._sourceServer[this._serverIdx]);
        this._serverIdx = (this._serverIdx + 1) % this._sourceServer.length;
    }
    return (url);
};
