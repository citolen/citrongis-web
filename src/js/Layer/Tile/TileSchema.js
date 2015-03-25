/*
**
**  TileSchema.js
**
**  Author citolen
**  07/02/2015
**
*/

var C = C || {};
C.Layer = C.Layer || {};
C.Layer.Tile = C.Layer.Tile || {};

C.Layer.Tile.yAxis = {
    NORMAL: 0,
    INVERTED: 1
};

C.Layer.Tile.TileSchema = C.Utils.Inherit(function (base, option) {

    'use strict';

    this._extent = option.extent;

    this._tileWidth = option.tileWidth;

    this._tileHeight = option.tileHeight;

    this._resolutions = option.resolutions;

    this._yAxis = option.yAxis;

    this._originX = option.originX;

    this._originY = option.originY;

    this._bounds = [];

    this._resolution = 0;

    this.calculateBounds();

    /*
    **  Tile hashmap
    */
    this._unchangedTiles = {};
    this._removedTiles = {};
    this._addedTiles = {};

}, EventEmitter, 'C.Layer.Tile.TileSchema');

C.Layer.Tile.TileSchema.prototype.tileToWorld = function (tileIndex, resolutionId) {

    'use strict';

    throw 'Not implemented';
};

C.Layer.Tile.TileSchema.prototype.worldToTile = function (world, resolutionId) {

    'use strict';

    throw 'Not implemented';
};

C.Layer.Tile.TileSchema.prototype.calculateBounds = function () {

    'use strict';

    for (var i = 0; i < this._resolutions.length; ++i) {
        this._bounds[i] = 1 << i;
    }
};

C.Layer.Tile.TileSchema.prototype.getZoomLevel = function (resolution) {

    'use strict';

    for (var i = 0; i < this._resolutions.length; ++i) {
        var res = this._resolutions[i];
        if (resolution > res && !C.Utils.Comparison.Equals(resolution, res)) {
            i = (i > 0) ? (i - 1) : (0);
            return (i);
        }
    }
    return (this._resolutions.length - 1);
};

C.Layer.Tile.TileSchema.prototype.fitToBounds = function (point, bound, floor) {

    'use strict';
    if (floor) {
        point._x = Math.floor(point._x);
        point._y = Math.floor(point._y);
    }
    if (point._x < 0)
        point._x = 0;
    if (point._y < 0)
        point._y = 0;
    if (point._x > bound)
        point._x = bound;
    if (point._y > bound)
        point._y = bound;
};

C.Layer.Tile.TileSchema.prototype._mergeTiles = function () {

    'use strict';

    for (var key in this._addedTiles) {
        this._unchangedTiles[key] = this._addedTiles[key];
    }
};

C.Layer.Tile.TileSchema.prototype.getCurrentTiles = function () {

    'use strict';

    var result = {};

    for (var key in this._unchangedTiles) {
        result[key] = this._unchangedTiles[key];
    }
    for (var key in this._addedTiles) {
        result[key] = this._addedTiles[key];
    }
    return (result);
};

C.Layer.Tile.TileSchema.prototype.isTileInView = function (tileIndex) {

    'use strict';

    if (tileIndex._BId in this._unchangedTiles)
        return (true);
    if (tileIndex._BId in this._addedTiles)
        return (true);
    return (false);
};

C.Layer.Tile.TileSchema.prototype.computeTiles = function (viewport) {

    'use strict';

    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) { // Compute tile with rotation

    } else {

        var zoom = this.getZoomLevel(viewport._resolution);
        this._resolution = this._resolutions[zoom];

        var size = this._resolution / viewport._resolution * this._tileWidth;

        var topLeft = this.worldToTile(viewport._bbox._topLeft, viewport._resolution, size);
        var topRight = this.worldToTile(viewport._bbox._topRight, viewport._resolution, size);
        var bottomRight = this.worldToTile(viewport._bbox._bottomRight, viewport._resolution, size);
        var bottomLeft = this.worldToTile(viewport._bbox._bottomLeft, viewport._resolution, size);

        var bound = this._bounds[zoom];

        this.fitToBounds(topLeft, bound, true);
        this.fitToBounds(topRight, bound);
        this.fitToBounds(bottomRight, bound);
        this.fitToBounds(bottomLeft, bound);



        var tiles = {};

        this._mergeTiles();
        var addedTilesCount = 0;
        this._addedTiles = {};  // reset added tiles
        var removedTilesCount = 0;
        this._removedTiles = {}; // reset removed tiles

        for (var y = topLeft._y; y < bottomLeft._y; ++y) {
            for (var x = topLeft._x; x < topRight._x; ++x) {
                var tile = C.Layer.Tile.TileIndex.fromXYZ(x, y, zoom);
                tiles[tile._BId] = tile;
                if (!(tile._BId in this._unchangedTiles)) { // this is a new tile
                    this._addedTiles[tile._BId] = tile;
                    ++addedTilesCount;
                }
            }
        }

        /** Compute removed tiles **/
        for (var key in this._unchangedTiles) {
            if (!(key in tiles)) { // this is a removed tile
                this._removedTiles[key] = this._unchangedTiles[key];
                delete this._unchangedTiles[key];
                ++removedTilesCount;
            }
        }

        if (removedTilesCount > 0)
            this.emit('removedTiles', this._removedTiles, viewport);
        if (addedTilesCount > 0)
            this.emit('addedTiles', this._addedTiles, viewport);
    }
};