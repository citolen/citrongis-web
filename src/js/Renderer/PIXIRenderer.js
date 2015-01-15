/*
**
**  PIXIRenderer.js
**
**  Author citolen
**  13/01/2015
**
*/

var C = C || {};
C.Renderer = C.Renderer || {};

C.Renderer.PIXIRenderer = C.Utils.Inherit(function (base, citronGIS) {

    'use strict';
    base(citronGIS);

    console.log('--PIXI renderer--');
}, C.Renderer.RendererBase, 'C.Renderer.RendererBase');

////////////////////////
//  FEATURE RENDERING //
////////////////////////
C.Renderer.PIXIRenderer.prototype.featureChange = function (eventType, feature, layer) {

    'use strict';
    switch (eventType) {
        case C.Geo.Feature.Feature.EventType.ADDED:
            this.featureAdded(feature, layer);
            break;
        case C.Geo.Feature.Feature.EventType.REMOVED:
            this.featureRemoved(feature, layer);
            break;
        case C.Geo.Feature.Feature.EventType.UPDATED:
            this.featureUpdated(feature, layer);
            break;
    }
};

C.Renderer.PIXIRenderer.prototype.featureAdded = function (feature, layer) {

    'use strict';
    switch (feature._type) {
        case C.Geo.Feature.Feature.FeatureType.CIRCLE:
            this.renderCircle(feature, layer);
            break;
        case C.Geo.Feature.Feature.FeatureType.IMAGE:
            this.renderImage(feature, layer);
            break;
        case C.Geo.Feature.Feature.FeatureType.LINE:
            this.renderLine(feature, layer);
            break;
        case C.Geo.Feature.Feature.FeatureType.POLYGON:
            this.renderPolygon(feature);
            break;
    }
    layer.__graphics.addChild(feature.__graphics);
};

/*
**
**  Render Circle
**
*/
C.Renderer.PIXIRenderer.prototype.renderCircle = function (feature, layer) {

    'use strict';

    feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);

    var g = feature.__graphics = feature.__graphics || new PIXI.Graphics();

    g.clear();
    g.lineStyle(feature._outlineWidth, feature._outlineColor);
    g.beginFill(feature._backgroundColor);
    g.drawCircle(0, 0, feature._radius);
    g.endFill();

    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    g.position = new PIXI.Point(position.X, position.Y);
};

/*
**
**  Render Image
**
*/
C.Renderer.PIXIRenderer.prototype.renderImage = function (feature) {

    'use strict';

    feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);

    feature.__texture = PIXI.Texture.fromImage(feature._source);
    var sprite = feature.__graphics = new PIXI.Sprite(feature.__texture);

    sprite.width = feature._width;
    sprite.height = feature._height;

    sprite.anchor.x = feature._anchorX;
    sprite.anchor.y = feature._anchorY;

    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    sprite.position = new PIXI.Point(position.X, position.Y);
    sprite.rotation = -this._viewport._rotation;
};

/*
**
**  Render Line
**
*/
C.Renderer.PIXIRenderer.prototype.renderLine = function (feature, layer) {

    'use strict';

    if (feature._locations.length < 2) return;

    feature.__locations = [];
    for (var i = 0; i < feature._locations.length; ++i) {
        feature.__locations.push(C.Helpers.CoordinatesHelper.TransformTo(feature._locations[i], this._viewport._schema._crs));
    }

    var g = feature.__graphics = feature.__graphics || new PIXI.Graphics();

    g.clear();
    g.lineStyle(feature._lineWidth, feature._lineColor);
    g.beginFill(feature._lineColor);

    var origin;

    for (var i = 0; i < feature.__locations.length; ++i) {
        var loc = feature.__locations[i];
        var pt = this._viewport.worldToScreen(loc.X, loc.Y);
        if (i === 0) {
            origin = pt;
            g.moveTo(0, 0);
            continue;
        }
        g.lineTo(pt.X - origin.X, pt.Y - origin.Y);
    }
    g.position = new PIXI.Point(origin.X, origin.Y);
    g.endFill();
};

/*
**
**  Render Polygon
**
*/
C.Renderer.PIXIRenderer.prototype.renderPolygon = function (feature) {

    'use strict';

    if (feature._locations.length < 3) return;

    feature.__locations = [];
    for (var i = 0; i < feature._locations.length; ++i) {
        feature.__locations.push(C.Helpers.CoordinatesHelper.TransformTo(feature._locations[i], this._viewport._schema._crs));
    }

    var g = feature.__graphics = feature.__graphics || new PIXI.Graphics();

    g.clear();
    g.lineStyle(feature._outlineWidth, feature._outlineColor);
    g.beginFill(feature._fillColor);

    var origin;
    var points = [];
    for (var i = 0; i < feature.__locations.length; ++i) {
        var loc = feature.__locations[i];
        var pt = this._viewport.worldToScreen(loc.X, loc.Y);
        if (i === 0) {
            origin = pt;
            points.push(new PIXI.Point(0, 0));
            continue;
        }
        points.push(new PIXI.Point(pt.X - origin.X, pt.Y - origin.Y));
    }

    g.drawPolygon(points);
    g.endFill();
    g.position = new PIXI.Point(origin.X, origin.Y);
};

C.Renderer.PIXIRenderer.prototype.featureRemoved = function (feature, layer) {

    'use strict';

    if (feature.__graphics) {
        layer.__graphics.removeChild(feature.__graphics);
        //TODO: maybe you can unload and release the texture
        feature.__texture = undefined;
    }
};

C.Renderer.PIXIRenderer.prototype.featureUpdated = function (feature) {

    'use strict';

    switch (feature._type) {
        case C.Geo.Feature.Feature.FeatureType.CIRCLE:
            this.renderCircle(feature);
            break;
        case C.Geo.Feature.Feature.FeatureType.IMAGE:
            this.updateImage(feature);
            break;
        case C.Geo.Feature.Feature.FeatureType.LINE:
            this.renderLine(feature);
            break;
        case C.Geo.Feature.Feature.FeatureType.POLYGON:
            this.renderPolygon(feature);
            break;
    }
};

C.Renderer.PIXIRenderer.prototype.updateImage = function (feature) {

    'use strict';

    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.LOCATION) != 0) {
        feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position = new PIXI.Point(position.X, position.Y);
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.SOURCE) != 0) {
        feature.__texture = PIXI.Texture.fromImage(feature._source);
        feature.__graphics.setTexture(feature.__texture);
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.WIDTH) != 0) {
        feature.__graphics.width = feature._width;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.HEIGHT) != 0) {
        feature.__graphics.height = feature._height;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.ANCHORX) != 0) {
        feature.__graphics.anchor.x = feature._anchorX;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.ANCHORY) != 0) {
        feature.__graphics.anchor.y = feature._anchorY;
    }
};

C.Renderer.PIXIRenderer.prototype.updateFeaturePosition = function (feature) {

    'use strict';

    if (feature.__location !== undefined) { // Circle,Image
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;
        feature.__graphics.position.y = position.Y;
        return;
    }
    if (feature.__locations !== undefined) { // Line,Polygon
        var position = this._viewport.worldToScreen(feature.__locations[0].X, feature.__locations[0].Y);
        feature.__graphics.position.x = position.X;
        feature.__graphics.position.y = position.Y;
    }
};

//////////////////////
//  LAYER RENDERING //
//////////////////////
C.Renderer.PIXIRenderer.prototype.layerChange = function (eventType, layer) {

    'use strict';
    switch (eventType) {
        case C.Geo.Layer.EventType.ADDED:
            this.layerAdded(layer);
            break;
        case C.Geo.Layer.EventType.REMOVED:
            this.layerRemoved(layer);
            break;
        case C.Geo.Layer.EventType.UPDATED:
            this.layerUpdated(layer);
            break;
        case C.Geo.Layer.EventType.MOVED:
            this.layerMoved(layer);
            break;
    }
};

C.Renderer.PIXIRenderer.prototype.layerAdded = function (layer) {

    'use strict';

    layer.__graphics = new PIXI.DisplayObjectContainer();
    layer._group.__graphics.addChild(layer.__graphics);
};

C.Renderer.PIXIRenderer.prototype.layerRemoved = function (layer) {

    'use strict';
    layer._group.__graphics.removeChild(layer.__graphics);
};

C.Renderer.PIXIRenderer.prototype.layerUpdated = function (layer) {

    'use strict';
};

C.Renderer.PIXIRenderer.prototype.layerMoved = function (layer) {

    'use strict';
};

//////////////////////
//  GROUP RENDERING //
//////////////////////
C.Renderer.PIXIRenderer.prototype.groupChange = function (eventType, group) {

    'use strict';

    switch (eventType) {
        case C.Extension.LayerGroup.EventType.ADDED:
            this.groupAdded(group);
            break;
        case C.Extension.LayerGroup.EventType.REMOVED:
            this.groupRemoved(group);
            break;
        case C.Extension.LayerGroup.EventType.MOVED:
            this.groupMoved(group);
            break;
    }
};

C.Renderer.PIXIRenderer.prototype.groupAdded = function (group) {

    'use strict';
    group.__graphics = new PIXI.DisplayObjectContainer();
    this._stage.addChild(group.__graphics);
};

C.Renderer.PIXIRenderer.prototype.groupRemoved = function (group) {

    'use strict';
    this._stage.removeChild(group.__graphics);
};

C.Renderer.PIXIRenderer.prototype.groupMoved = function (group) {

    'use strict';
};

///////////////////////
//  UPDATE POSITIONS //
///////////////////////
C.Renderer.PIXIRenderer.prototype.updatePositions = function () {

    'use strict';

    var groups = this._layerManager._layerGroups;
    for (var i = 0; i < groups.length; ++i) {
        var layers = groups[i]._layers;
        for (var j = 0; j < layers.length; ++j) {
            var features = layers[j]._features;
            for (var k = 0; k < features.length; ++k) {
                this.updateFeaturePosition(features[k]);
            }
        }
    }
};
