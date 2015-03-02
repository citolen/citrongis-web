/*
**
**  TileLayer.js
**
**  Author citolen
**  01/03/2015
**
*/

var C = C || {};
C.Layer = C.Layer || {};
C.Layer.Tile = C.Layer.Tile || {};

C.Layer.Tile.TileLayer = C.Utils.Inherit(function (base, options) {

    base(options);

    this._source = options.source;

    this._schema = options.schema;


    this._schema.on('addedTiles', this.addedTile.bind(this));
    this._schema.on('removedTiles', this.removedTile.bind(this));

    this._tileInView = {};

}, C.Geo.Layer, 'C.Layer.Tile.TileLayer');

C.Layer.Tile.TileLayer.prototype.addedTile = function (addedTiles, viewport) {

    'use strict';

    var self = this;

    //console.log('added', addedTiles);
    for (var key in addedTiles) {
        var tile = addedTiles[key];
        var url = this._source.tileIndexToUrl(tile);
        var location = this._schema.tileToWorld(tile, this._schema._resolutions[tile._z]);
        location = new C.Geometry.Point(location.X, location.Y, 0, viewport._schema._crs);

        var feature = new C.Geo.Feature.Image({
            location: location,
            width: this._schema._tileWidth,
            height: this._schema._tileHeight,
            anchorX: 0,
            anchorY: 0,
            source: url
        });
        this.addFeature(feature);
        this._tileInView[key] = feature;
        feature.on('loaded', function () {
            //console.log('loaded');
            if (!self._schema.isTileInView(tile)) {
                self.removeFeature(feature);
                delete self._tileInView[key];
            }
        });
    }
};

C.Layer.Tile.TileLayer.prototype.removedTile = function (removedTiles, viewport) {

    'use strict';

    //console.log('removed', removedTiles);
    for (var key in removedTiles) {
        if (key in this._tileInView) {
            this.removeFeature(this._tileInView[key]);
            delete this._tileInView[key];
        }
    }
};
