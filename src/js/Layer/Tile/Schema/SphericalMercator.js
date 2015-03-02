/*
**
**  SphericalMercator.js
**
**  Author citolen
**  07/02/2015
**
*/

var C = C || {};
C.Layer = C.Layer || {};
C.Layer.Tile = C.Layer.Tile || {};
C.Layer.Tile.Schema = C.Layer.Tile.Schema || {};

C.Layer.Tile.Schema.SphericalMercator = C.Utils.Inherit(function (base) {

    'use strict';

    base({

        extent: new C.Geometry.Extent(-20037508.342789,
                                      -20037508.342789,
                                      20037508.342789,
                                      20037508.342789),

        tileWidth:  256,
        tileHeight: 256,

        yAxis: C.Layer.Tile.yAxis.INVERTED,

        resolutions: [156543.033900000, 78271.516950000, 39135.758475000, 19567.879237500,
                      9783.939618750, 4891.969809375, 2445.984904688, 1222.992452344,
                      611.496226172, 305.748113086, 152.874056543, 76.437028271,
                      38.218514136, 19.109257068, 9.554628534, 4.777314267,
                      2.388657133, 1.194328567, 0.597164283, 0.29858214168548586, 0.14929107084274293, 0.07464553542137146],

        originX: -20037508.342789,
        originY: -20037508.342789
    });

}, C.Layer.Tile.TileSchema, 'C.Layer.Tile.Schema.SphericalMercator');

C.Layer.Tile.Schema.SphericalMercator.prototype.tileToWorld = function (tileIndex, resolution) {

    'use strict';

    var worldX = this._extent._minX + tileIndex._x * this._tileWidth * resolution;
    var worldY = tileIndex._y * this._tileHeight * resolution;
    if (this.yAxis == C.Layer.Tile.yAxis.NORMAL)
        worldY = this._extent._minY + worldY;
    else
        worldY = this._extent._maxY - worldY;
    return (new C.Geometry.Vector2(worldX, worldY));
};

C.Layer.Tile.Schema.SphericalMercator.prototype.worldToTile = function (world, resolution) {

    'use strict';

    var tileX = (world.X - this._extent._minX) / resolution / this._tileWidth;
    var tileY = world.Y;
    if (this._yAxis == C.Layer.Tile.yAxis.NORMAL)
        tileY = tileY - this._extent._minY;
    else
        tileY = this._extent._maxY - tileY;
    tileY = tileY / resolution / this._tileHeight;
    var tileZ = this.getZoomLevel(resolution);
    return (C.Layer.Tile.TileIndex.fromXYZ(tileX, tileY, tileZ));
};

C.Layer.Tile.Schema.SphericalMercator = new C.Layer.Tile.Schema.SphericalMercator();
