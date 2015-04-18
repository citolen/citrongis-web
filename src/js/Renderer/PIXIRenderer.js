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

    this._dirtyFeatures = [];

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
    feature._dirty = false;
};

/*
**
**  Render Image
**
*/
C.Renderer.PIXIRenderer.prototype.renderImage = function (feature) {

    'use strict';

    feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);

    var sprite = feature.__graphics = new PIXI.Sprite(feature.__texture);

    if (feature.__texture) {
        feature.__texture.baseTexture.scaleMode = this._scaleModeConvert(feature._scaleMode);
    }

    sprite.width = feature._width;
    sprite.height = feature._height;

    sprite.anchor.x = feature._anchorX;
    sprite.anchor.y = feature._anchorY;

    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    sprite.position = new PIXI.Point(position.X, position.Y); //new PIXI.Point(Math.floor(position.X + 0.5), Math.floor(position.Y + 0.5));

    feature._xRoundWay = sprite.position.x - position.X;
    feature._yRoundWay = sprite.position.y - position.Y;

    sprite.width = feature._width;//Math.floor(feature._width - feature._xRoundWay +0.5);
    sprite.height = feature._height;//Math.floor(feature._height - feature._yRoundWay +0.5);

    sprite.rotation = -this._viewport._rotation;
    feature._dirty = false;
};

/*
**
**  Render Line
**
*/
C.Renderer.PIXIRenderer.prototype.renderLine = function (feature, layer) {

    'use strict';

    if (feature._locations.length < 2) return;

    if (feature._locationChanged) {
        feature.__locations = [];
        for (var i = 0; i < feature._locations.length; ++i) {
            feature.__locations.push(C.Helpers.CoordinatesHelper.TransformTo(feature._locations[i], this._viewport._schema._crs));
        }
        feature.__locationChanged = false;
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
    feature._dirty = false;
};

/*
**
**  Render Polygon
**
*/
C.Renderer.PIXIRenderer.prototype.renderPolygon = function (feature) {

    'use strict';

    if (feature._locations.length < 3) return;

    if (feature._locationChanged) {
        feature.__locations = [];
        for (var i = 0; i < feature._locations.length; ++i) {
            feature.__locations.push(C.Helpers.CoordinatesHelper.TransformTo(feature._locations[i], this._viewport._schema._crs));
        }
        feature._locationChanged = false;
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
    feature._dirty = false;
};

C.Renderer.PIXIRenderer.prototype.featureRemoved = function (feature, layer) {

    'use strict';

    if (feature.__graphics) {
        layer.__graphics.removeChild(feature.__graphics);
        var index = this._dirtyFeatures.indexOf(feature);
        if (index > -1) {
            feature._noted = false;
            this._dirtyFeatures.splice(index, 1);
        }
    }
};

/*
**
**
**  Feature Updated, makeDirty()
**
*/
C.Renderer.PIXIRenderer.prototype.featureUpdated = function (feature) {

    'use strict';

    // Update opacity
    if ((feature._mask & C.Geo.Feature.Feature.OpacityMask) != 0) {
        if (feature.__graphics)
            feature.__graphics.alpha = feature._opacity;
        feature._mask -= C.Geo.Feature.Feature.OpacityMask;
        if (feature._mask == 0)
            return;
    }

    if (feature._noted) return;
    this._dirtyFeatures.push(feature);
    feature._noted = true;
};

C.Renderer.PIXIRenderer.prototype.updateFeature = function () {

    'use strict';

    for (var i = 0; i < this._dirtyFeatures.length; ++i) {
        var feature = this._dirtyFeatures[i];
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
        feature._noted = undefined;
        feature._mask = 0;
    }
    this._dirtyFeatures = [];
};

C.Renderer.PIXIRenderer.prototype.updateImage = function (feature) {

    'use strict';

    var xRoundWay = 0;
    var yRoundWay = 0;


    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.LOCATION) != 0) {
        feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;//Math.floor(position.X + 0.5);
        feature.__graphics.position.y = position.Y;//Math.floor(position.Y + 0.5);

        feature._xRoundWay = feature.__graphics.position.x - position.X;
        feature._yRoundWay = feature.__graphics.position.y - position.Y;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.SOURCE) != 0) {
        feature.__graphics.setTexture(feature.__texture);
        feature._mask |= C.Geo.Feature.Image.MaskIndex.WIDTH;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.HEIGHT;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.SCALEMODE;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.WIDTH) != 0) {
        feature.__graphics.width = feature._width;//Math.floor(feature._width - feature._xRoundWay +0.5);
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.HEIGHT) != 0) {
        feature.__graphics.height = feature._height;//Math.floor(feature._height - feature._yRoundWay +0.5);
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.ANCHORX) != 0) {
        feature.__graphics.anchor.x = feature._anchorX;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.ANCHORY) != 0) {
        feature.__graphics.anchor.y = feature._anchorY;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.ROTATION) != 0) {
        feature.__graphics.rotation = feature._rotation;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.SCALEMODE) != 0) {

        if (feature.__texture) {
            feature.__texture.baseTexture.scaleMode = this._scaleModeConvert(feature._scaleMode);
            feature.__texture.baseTexture.dirty();
        }
    }
};

C.Renderer.PIXIRenderer.prototype.updateFeaturePosition = function (feature) {

    'use strict';

    if (feature.__location !== undefined) { // Circle,Image
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;//Math.floor(position.X + 0.5);
        feature.__graphics.position.y = position.Y;//Math.floor(position.Y + 0.5);
        return;
    }
    if (feature.__locations !== undefined) { // Line,Polygon
        switch (feature._type) {
            case C.Geo.Feature.Feature.FeatureType.LINE:
                this.renderLine(feature);
                break;
            case C.Geo.Feature.Feature.FeatureType.POLYGON:
                this.renderPolygon(feature);
                break;
        }
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

    if ((layer._mask & C.Geo.Layer.Mask.OPACITY) != 0) {
        layer._mask -= C.Geo.Layer.Mask.OPACITY;
        if (layer.__graphics) {
            layer.__graphics.alpha = layer._opacity;
        }
    }
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

C.Renderer.PIXIRenderer.prototype.renderFrame = function () {

    'use strict';

    this.updateFeature();
};

C.Renderer.PIXIRenderer.prototype._scaleModeConvert = function (scaleMode) {
    if (scaleMode == C.Geo.Feature.Image.ScaleMode.NEAREST)
        return PIXI.scaleModes.NEAREST;
    return PIXI.scaleModes.DEFAULT;
};
