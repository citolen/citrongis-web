/*
**
**  TileIndex.js
**
**  Author citolen
**  07/02/2015
**
*/

var C = C || {};
C.Layer = C.Layer || {};
C.Layer.Tile = C.Layer.Tile || {};

C.Layer.Tile.TileIndex = function (x, y, z, BId) {

    'use strict';

    this._x = x || 0;

    this._y = y || 0;

    this._z = z || 0;

    this._BId = BId.toString();
};

C.Layer.Tile.TileIndex.fromXYZ = function (x, y, z) {

    'use strict';

    return (new C.Layer.Tile.TileIndex(x, y, z, C.Layer.Tile.TileIndex.createBId(x, y, z)));
};

C.Layer.Tile.TileIndex.fromBId = function (BId) {

    'use strict';

    var h = BId.getHighBits();
    var l = BId.getLowBits();
    var z = h >>> 16;
    var x = (h << 16 >>> 8) | (l >>> 24);
    var y = (l << 8 >>> 8);
    return (new C.Layer.Tile.TileIndex(x, y, z, BId));
};

C.Layer.Tile.TileIndex.createBId = function (x, y, z) {

    'use strict';

    return (new Long((x << 24) | (y << 8 >>> 8), (z << 16) | (x >>> 8)));
};

C.Layer.Tile.TileIndex.prototype.positionInTile = function (tile) {

    'use strict';

    if (this._z >= tile._z)
        return (null);

    var dZ = tile._z - this._z;
    var pZ = 1 << dZ;
    return ({
        x:tile._x / pZ - this._x,
        y:tile._y / pZ - this._y,
        pZ: pZ });
};

C.Layer.Tile.TileIndex.prototype.levelUp = function () {

    'use strict';

    if (this._z == 0) return (this);
    var z = this._z - 1;
    var x = Math.floor(this._x / 2);
    var y = Math.floor(this._y / 2);
    return (C.Layer.Tile.TileIndex.fromXYZ(x, y, z));
};

C.Layer.Tile.TileIndex.prototype.levelDown = function () {

    'use strict';

    var z = this._z + 1;
    var x = this._x * 2;
    var y = this._y * 2;
    return ([C.Layer.Tile.TileIndex.fromXYZ(x,   y,   z),
             C.Layer.Tile.TileIndex.fromXYZ(x+1, y,   z),
             C.Layer.Tile.TileIndex.fromXYZ(x,   y+1, z),
             C.Layer.Tile.TileIndex.fromXYZ(x+1, y+1, z)]);
};
