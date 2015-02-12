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

C.Layer.Tile.Schema.SphericalMercator = new C.Layer.Tile.TileSchema({

    extent: new C.Geometry.Extent(-20037508.342789,
                                  -20037508.342789,
                                  20037508.342789,
                                  20037508.342789),

    tileWidth:  256,
    tileHeight: 256,

    yAxis: C.Layer.Tile.yAxis.NORMAL,

    resolutions: [156543.033900000, 78271.516950000, 39135.758475000, 19567.879237500,
                  9783.939618750, 4891.969809375, 2445.984904688, 1222.992452344,
                  611.496226172, 305.748113086, 152.874056543, 76.437028271,
                  38.218514136, 19.109257068, 9.554628534, 4.777314267,
                  2.388657133, 1.194328567, 0.597164283],

    originX: -20037508.342789,
    originY: -20037508.342789
});
