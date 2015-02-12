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

C.Layer.Tile.TileSchema = function(option) {

    'use strict';

    this._extent = option.extent;

    this._tileWidth = option.tileWidth;

    this._tileHeight = option.tileHeight;

    this._resolutions = option.resolutions;

    this._yAxis = option.yAxis;

    this._originX = option.originX;

    this._originY = option.originY;

    this._bounds = [];

    this.calculateBounds();
};

C.Layer.Tile.TileSchema.prototype.calculateBounds = function () {

    'use strict';

    for (var i = 0; i < this._resolutions.length; ++i) {
        this._bounds = 1 << i;
    }
};

C.Layer.Tile.TileSchema.prototype.getZoomLevel = function (resolution) {

    'use strict';


    for (var i = 0; i < this._resolutions.length; ++i) {
        var res = this._resolutions[i];
        if (resolution > res || C.Utils.Comparison.Equals(resolution, res))
            return (i);
    }
    return (this._resolutions.length);
};

C.Layer.Tile.TileSchema.prototype.computeTiles = function (viewport) {

    'use strict';

    if (!C.Utils.Comparison.Equals(viewport._rotation, 0)) { // Compute tile with rotation

    } else {
        console.log(viewport._bbox);
    }
};
