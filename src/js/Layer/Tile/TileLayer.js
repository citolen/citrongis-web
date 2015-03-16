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

}, C.Geo.Layer, 'C.Layer.Tile.TileLayer');

C.Layer.Tile.TileLayer.prototype.loadTile = function (tile, callback) {

    'use strict';

    if (!this._schema.isTileInView(tile)) {
        return callback(true);
    }

    var url = this._source.tileIndexToUrl(tile);
    var location = this._schema.tileToWorld(tile, this._schema._resolutions[tile._z]);
    location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);
    var feature = new C.Geo.Feature.Image({
        location: location,
        width: this._schema._tileWidth,
        height: this._schema._tileHeight,
        anchorX: 0,
        anchorY: 0,
        source: url
    });
    this.addFeature(feature);
    var key = tile._BId;
    this._tileInView[key] = {
        feature: feature
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

    for (var key in addedTiles) {
        var tile = addedTiles[key];

        var item = this._cache.get(key);

        if (item) {
            this._tileInView[key] = item;
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
                var size = self._schema._tileHeight / (1 << substitute.level);
                img._width = size;
                img._height = size;
                tiles.push(img);
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
            var location = this._schema.tileToWorld(tile, this._schema._resolutions[tile._z]);
            tmp._location = new C.Geometry.Point(location.X, location.Y, 0, C.Helpers.schema._crs);
            this.addFeature(tmp);

            this._substitution[tile._BId] = {
                tiles: [ tmp ]
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
        this.removeFeature(o.tiles[i]);
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
