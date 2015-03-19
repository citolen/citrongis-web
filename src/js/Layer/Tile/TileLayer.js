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

    this._substitution = {};

    this._cache = new LRUCache({
        max: 200
    });

    this._queue = async.queue(this.loadTile.bind(this), 5);

    C.Helpers.viewport.on('resolutionUpdate', this.updateResolution.bind(this));

}, C.Geo.Layer, 'C.Layer.Tile.TileLayer');

C.Layer.Tile.TileLayer.prototype.getTileSize = function () {
    'use strict';
    return (this._schema._resolution / C.Helpers.viewport._resolution * this._schema._tileWidth);
};

C.Layer.Tile.TileLayer.prototype.getAproxTileSize = function () {
    'use strict';
    return (this._schema._resolution / C.Helpers.viewport._resolution * this._schema._tileWidth + 0.5);
};

/*
**
**  Update the result of the tiles
**  Happen when you change the resolution between zoom level
**
**
**
*/
C.Layer.Tile.TileLayer.prototype.updateResolution = function () {

    'use strict';


    var rsize = this.getTileSize();
    var size = this.getAproxTileSize();


    for (var key in this._tileInView) {
        var obj = this._tileInView[key];

        obj.feature.width(size);
        obj.feature.height(size);
        var location = this._schema.tileToWorld(obj.tile, C.Helpers.viewport._resolution, rsize);
        obj.feature.location(new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs));
    }

    for (var key in this._substitution) {
        var objs = this._substitution[key].tiles;

        for (var i = 0,j = objs.length; i < j; ++i) {
            var obj = objs[i];
            var tsize = size;
            var trsize = rsize;
            if (obj.level != undefined) {
                trsize = rsize / (1 << obj.level);
                tsize = trsize + 0.5;
            }
            obj.feature.width(tsize);
            obj.feature.height(tsize);
            var location = this._schema.tileToWorld(obj.tile, C.Helpers.viewport._resolution, trsize);
            obj.feature.location(new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs));
        }
    }
};

/*
**
**  Queue function to load a file
**
**
**
**
*/
C.Layer.Tile.TileLayer.prototype.loadTile = function (tile, callback) {

    'use strict';

    if (!this._schema.isTileInView(tile)) {
        return callback(true);
    }

    var url = this._source.tileIndexToUrl(tile);

    var rsize = this.getTileSize();
    var size = this.getAproxTileSize();

    var location = this._schema.tileToWorld(tile, C.Helpers.viewport._resolution, rsize);
    location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);

    var feature = new C.Geo.Feature.Image({
        location: location,
        width: size,
        height: size,
        anchorX: 0,
        anchorY: 0,
        source: url
    });
    this.addFeature(feature);
    var key = tile._BId;
    this._tileInView[key] = {
        feature: feature,
        tile: tile
    };
    feature.on('loaded', (function (key) {
        if (!(key in this._tileInView)) { // tile is gone
            callback(true);
            return;
        }
        this._cache.set(key, this._tileInView[key]);
        this.tileLoaded.call(this, key);
        callback();
    }).bind(this, key));
    feature.load();
};

C.Layer.Tile.TileLayer.prototype.tileLoaded = function (key, noanim) {
    if (!(key in this._tileInView)) { // tile is gone
        return;
    }

    if (noanim)return;
    var self = this;
    // Opacity animation
    var o = this._tileInView[key];
    o.feature.__graphics.alpha = 0;
    (function f() {
        o.feature.__graphics.alpha += 0.1;
        if (o.feature.__graphics.alpha < 1)
            o.opacity_animation = setTimeout(f, 30);
        else {
            o.feature.__graphics.alpha = 1;
            delete o.opacity_animation;
            self.deleteSubstitute(key);
        }
    })();
};

C.Layer.Tile.TileLayer.prototype.addedTile = function (addedTiles, viewport) {

    'use strict';

    var self = this;
    var rsize = this.getTileSize();
    var size = this.getAproxTileSize();

    for (var key in addedTiles) {
        var tile = addedTiles[key];

        var item = this._cache.get(key);

        if (item) {
            this._tileInView[key] = item;
            item.feature.width(size);
            item.feature.height(size);
            var location = this._schema.tileToWorld(item.tile, C.Helpers.viewport._resolution, rsize);
            item.feature.location(new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs));
            this.addFeature(item.feature);
            this.tileLoaded.call(this, key, true);
        } else {
            this.createSubstitute(tile, viewport._zoomDirection);
            this._queue.push(tile);
        }
    }
};

C.Layer.Tile.TileLayer.prototype.createSubstitute = function (tile, zoomDirection) {

    'use strict';

    var trsize = this.getTileSize();
    var tsize = this.getAproxTileSize();

    if (zoomDirection == C.System.Viewport.zoomDirection.OUT) {
        var self = this;
        var substituteTiles = [];
        var coverage = (function explore(tile, level) {

            var children = tile.levelDown();
            var cover = 0;
            for (var i = 0; i < 4; ++i) {
                var child = children[i];
                var childObj = self._cache.get(child._BId);

                if (childObj) {
                    substituteTiles.push({
                        tile: child,
                        origin: childObj,
                        level: level
                    });
                    ++cover;
                } else if (child._z < self._schema._resolutions.length && level < 3) {
                    // Go Futher
                    if (explore(child, level + 1) != 4)
                        return 0;
                }
            }
            return cover;
        })(tile, 1);

        if (coverage == 4) {

            var tiles = [];
            for (var i = 0, j = substituteTiles.length; i < j; ++ i) {
                var substitute = substituteTiles[i];

                var img = substitute.origin.feature.copy();
                var rsize = trsize / (1 << substitute.level);
                var size = rsize + 0.5;

                var location = this._schema.tileToWorld(substitute.tile, C.Helpers.viewport._resolution, rsize);
                img._location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);
                img._width = size;
                img._height = size;
                tiles.push({
                    feature: img,
                    tile: substitute.tile,
                    level: substitute.level
                });
                this.addFeature(img);
            }

            this._substitution[tile._BId] = {
                tiles: tiles
            };

            return;
        }
    }

    var current = tile;
    while (current._z > 0) {
        var parent = current.levelUp();
        var parentObj = this._cache.get(parent._BId);
        if (parentObj) {
            var position = parent.positionInTile(tile);
            var size = this._schema._tileWidth / position.pZ;

            var tmp = parentObj.feature.crop(new PIXI.Rectangle(position.x * this._schema._tileWidth, position.y * this._schema._tileHeight, size, size));


            var location = this._schema.tileToWorld(tile, C.Helpers.viewport._resolution, trsize);
            tmp._location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);
            tmp._width = tsize;
            tmp._height = tsize;
            this.addFeature(tmp);

            this._substitution[tile._BId] = {
                tiles: [ {
                    feature: tmp,
                    tile: tile
                }]
            };
            break;
        }

        current = parent;
    }
};

C.Layer.Tile.TileLayer.prototype.deleteSubstitute = function (key) {

    'use strict';

    if (!(key in this._substitution))
        return;
    var o = this._substitution[key];
    for (var i = 0, j = o.tiles.length; i < j; ++i) {
        this.removeFeature(o.tiles[i].feature);
    }
    delete this._substitution[key];
};

C.Layer.Tile.TileLayer.prototype.removedTile = function (removedTiles, viewport) {

    'use strict';

    //console.log('removed', removedTiles);
    for (var key in removedTiles) {
        this.deleteSubstitute(key);
        if (key in this._tileInView) {
            var o = this._tileInView[key];
            if (o.opacity_animation) {
                clearTimeout(o.opacity_animation);
            }
            this.removeFeature(o.feature);
            delete this._tileInView[key];
        }
    }
};
