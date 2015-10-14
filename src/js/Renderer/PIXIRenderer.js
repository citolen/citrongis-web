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

    feature._wasHandled = true;
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
        case C.Geo.Feature.Feature.EventType.MOVED:
            this.featureMoved(feature, layer);
            break;
    }
};

C.Renderer.PIXIRenderer.prototype.featureMoved = function (moveInfo, layer) {
    if (layer.__graphics && moveInfo.feature.__graphics) {
        layer.__graphics.setChildIndex(moveInfo.feature.__graphics, moveInfo.toIdx);
    }
};

C.Renderer.PIXIRenderer.prototype.featureAdded = function (feature, layer) {

    'use strict';

//    if (!feature.__graphics || feature._dirty) {
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
            case C.Geo.Feature.Feature.FeatureType.TEXT:
                this.renderText(feature);
                break;
        }
        feature.__graphics.interactive = feature._interactive;
        feature.__graphics.alpha = feature._opacity;

        feature.__graphics.mousedown = function (event) { feature.__mousedown(event); }
        feature.__graphics.mousemove = function (event) { feature.__mousemove(event); }
        feature.__graphics.mouseup = function (event) { feature.__mouseup(event); }
        feature.__graphics.click = function (event) { feature.__click(event); }
//
//    } else {
//        this.updateFeaturePosition(feature);
//    }

    layer.__graphics.addChild(feature.__graphics);
};

/*
**
**  Render Text
**
*/
C.Renderer.PIXIRenderer.prototype.renderText = function (feature, layer) {

    'use strict';

    feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);

    var options = {};
    if (feature._fill) { options.fill = feature._fill; }
    if (feature._align) { options.align = feature._align; }
    if (feature._font) { options.font = feature._font; }

    var g = feature.__graphics = feature.__graphics || new PIXI.Text(feature._text, options);

    if (feature._anchor) {
        g.anchor = new PIXI.Point(feature._anchor[0], feature._anchor[1]);
    }
    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    g.position = new PIXI.Point(position.X, position.Y);
    feature._dirty = false;
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

    var sprite = feature.__graphics = feature.__graphics || new PIXI.Sprite(feature.__texture);

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

    sprite.width = feature._width;
    sprite.height = feature._height;

    sprite.rotation = feature._rotation;
    feature._dirty = false;
};

/*
**
**  Render Line
**
*/
C.Renderer.PIXIRenderer.prototype.renderLine = function (feature, layer) {

    'use strict';

    //    if (feature._locations.length < 2) return;

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
    //    g.beginFill(/*feature._lineColor*/0xffffff);

    var origin;

    for (var i = 0; i < feature.__locations.length; ++i) {
        var loc = feature.__locations[i];
        var pt = this._viewport.worldToScreen(loc.X, loc.Y);
        if (i === 0) {
            origin = pt;
            g.moveTo(0, 0);
            g.position = new PIXI.Point(origin.X, origin.Y);
            continue;
        }
        g.lineTo(pt.X - origin.X, pt.Y - origin.Y);
    }
    g.endFill();
    if (g.currentPath) {
        g.currentPath.shape.closed = false;
    }
    feature._dirty = false;
};

/*
**
**  Render Polygon
**
*/
C.Renderer.PIXIRenderer.prototype.renderPolygon = function (feature) {

    'use strict';

    //    if (feature._locations.length < 3) return;

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
            g.position = new PIXI.Point(origin.X, origin.Y);
            continue;
        }
        points.push(new PIXI.Point(pt.X - origin.X, pt.Y - origin.Y));
    }

    g.drawPolygon(points);
    g.endFill();
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
    if ((feature._mask & C.Geo.Feature.Feature.InteractiveMask) != 0) {
        if (feature.__graphics)
            feature.__graphics.interactive = feature._interactive;
        feature._mask -= C.Geo.Feature.Feature.InteractiveMask;
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
        if (feature.__graphics) {
            switch (feature._type) {
                case C.Geo.Feature.Feature.FeatureType.CIRCLE:
                    if (feature.__location && feature._mask == C.Geo.Feature.Circle.MaskIndex.LOCATION) {
                        if (feature._locationChanged) {
                            feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);
                            feature._locationChanged = false;
                        }
                        this.updateFeaturePosition(feature);
                    } else {
                        this.renderCircle(feature);
                    }
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
                case C.Geo.Feature.Feature.FeatureType.TEXT:
                    this.updateText(feature);
                    break;
            }
        }
        feature._noted = undefined;
        feature._mask = 0;
    }
    this._dirtyFeatures = [];
};

C.Renderer.PIXIRenderer.prototype.updateText = function (feature) {
    'use strict';

    if ((feature._mask & C.Geo.Feature.Text.MaskIndex.LOCATION) != 0) {
        feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;
        feature.__graphics.position.y = position.Y;
    }
    if ((feature._mask & C.Geo.Feature.Text.MaskIndex.TEXT) != 0) {
        feature.__graphics.text = feature._text;
    }
    if ((feature._mask & C.Geo.Feature.Text.MaskIndex.FILL) != 0) {
        feature.__graphics.style.fill = feature._fill;
    }
    if ((feature._mask & C.Geo.Feature.Text.MaskIndex.ALIGN) != 0) {
        feature.__graphics.style.align = feature._align;
    }
    if ((feature._mask & C.Geo.Feature.Text.MaskIndex.FONT) != 0) {
        feature.__graphics.style.font = feature._font;
    }
    if ((feature._mask & C.Geo.Feature.Text.MaskIndex.ANCHOR) != 0) {
        feature.__graphics.anchor = new PIXI.Point(feature._anchor[0], feature._anchor[1]);
    }
};

C.Renderer.PIXIRenderer.prototype.updateImage = function (feature) {

    'use strict';

    //    var xRoundWay = 0;
    //    var yRoundWay = 0;


    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.LOCATION) != 0) {
        feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;//Math.floor(position.X + 0.5);
        feature.__graphics.position.y = position.Y;//Math.floor(position.Y + 0.5);

        //        feature._xRoundWay = feature.__graphics.position.x - position.X;
        //        feature._yRoundWay = feature.__graphics.position.y - position.Y;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.SOURCE) != 0) {
        feature.__graphics.texture = feature.__texture;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.WIDTH;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.HEIGHT;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.SCALEMODE;
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
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.ROTATION) != 0) {
        feature.__graphics.rotation = feature._rotation;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.SCALEMODE) != 0) {
        if (feature.__texture) {
            feature.__texture.baseTexture.scaleMode = this._scaleModeConvert(feature._scaleMode);
            feature.__texture.update();
        }
    }
};

C.Renderer.PIXIRenderer.prototype.updateFeaturePosition = function (feature) {

    'use strict';

    if (feature.__location !== undefined) { // Circle,Image,Text
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;
        feature.__graphics.position.y = position.Y;
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

    layer._wasHandled = true;
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

    layer.__graphics = layer.__graphics || new PIXI.Container();
    layer.__graphics.interactive = true;

    if (layer._parent && layer._parent.__graphics) {
        layer._parent.__graphics.addChild(layer.__graphics);
    } else if (layer._parent === 42) {
        this._stage.addChild(layer.__graphics);
    }
    //    layer._group.__graphics.addChild(layer.__graphics);
    //layer.__graphics.cacheAsBitmap = true;
};

C.Renderer.PIXIRenderer.prototype.layerRemoved = function (layer) {

    'use strict';

    if (layer._parent && layer._parent.__graphics) {
        layer._parent.__graphics.removeChild(layer.__graphics);
    } else {
        this._stage.removeChild(layer.__graphics);
    }
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
//C.Renderer.PIXIRenderer.prototype.groupChange = function (eventType, group) {
//
//    'use strict';
//
//    switch (eventType) {
//        case C.Extension.LayerGroup.EventType.ADDED:
//            this.groupAdded(group);
//            break;
//        case C.Extension.LayerGroup.EventType.REMOVED:
//            this.groupRemoved(group);
//            break;
//        case C.Extension.LayerGroup.EventType.MOVED:
//            this.groupMoved(group);
//            break;
//    }
//};
//
//C.Renderer.PIXIRenderer.prototype.groupAdded = function (group) {
//
//    'use strict';
//    group.__graphics = new PIXI.Container();
//    group.__graphics.interactive = true;
//    this._stage.addChild(group.__graphics);
//};
//
//C.Renderer.PIXIRenderer.prototype.groupRemoved = function (group) {
//
//    'use strict';
//    this._stage.removeChild(group.__graphics);
//};
//
//C.Renderer.PIXIRenderer.prototype.groupMoved = function (group) {
//
//    'use strict';
//};

///////////////////////
//  UPDATE POSITIONS //
///////////////////////
C.Renderer.PIXIRenderer.prototype.updatePositions = function () {

    'use strict';

    var self = this;

    function it_layer(layer) {
        var features = layer._features;
        for (var k = 0; k < features.length; ++k) {
            var feature = features[k];
            if (feature._features) {
                it_layer(feature);
            } else {
                self.updateFeaturePosition(feature);
            }
        }
    }

    var layers = this._layerManager._layers;
    for (var i = 0; i < layers.length; ++i) {
        it_layer(layers[i]);
    }

    //    var groups = this._layerManager._layerGroups;
    //    for (var i = 0; i < groups.length; ++i) {
    //        var layers = groups[i]._layers;
    //        for (var j = 0; j < layers.length; ++j) {
    //            var features = layers[j]._features;
    //            for (var k = 0; k < features.length; ++k) {
    //                this.updateFeaturePosition(features[k]);
    //            }
    //        }
    //    }
};

C.Renderer.PIXIRenderer.prototype.renderFrame = function () {

    'use strict';

    this.updateFeature();
};

C.Renderer.PIXIRenderer.scaleModeConvert = C.Renderer.PIXIRenderer.prototype._scaleModeConvert = function (scaleMode) {
    if (scaleMode == C.Geo.Feature.Image.ScaleMode.NEAREST)
        return PIXI.SCALE_MODES.NEAREST;
    return PIXI.SCALE_MODES.DEFAULT;
};

C.Helpers.RendererHelper.Image.load = function (feature) {

    var self = feature;

    switch (C.Utils.Path.getType(feature._source)) {
        case 0:
            /*
             *  HTTP
             */
            feature._loader = new PIXI.loaders.Loader().add('image', feature._source, {
                loadType: 2
            });

            feature._loader.once('complete', function (loader, resources) {

                feature.__texture = resources.image.texture;

                feature.emit('loaded', self);
                feature._mask |= C.Geo.Feature.Image.MaskIndex.SOURCE;
                feature.emit('sourceChanged', self._source);
                feature.makeDirty();

            });

            feature._loader.once('error', function () {
                feature.emit('error', self);
            });

            feature._loader.load();
            break;
        case 1:
            /*
             *  In-app resource
             */
            if (feature._context) {
                feature._context._resources.file(feature._source, function (err, handle) {

                    if (err) {
                        return feature.emit('error', self);
                    }

                    var bytes = handle.asUint8Array();
                    var binary = '';
                    for (var i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i])
                    }
                    var imageb64 = 'data:image/png;base64,' + window.btoa(binary);
                    var img = new Image();
                    img.onload = function () {
                        feature.__texture = new PIXI.Texture(new PIXI.BaseTexture(img, C.Renderer.PIXIRenderer.scaleModeConvert(feature._scaleMode)));
                        feature.emit('loaded', self);
                        feature._mask |= C.Geo.Feature.Image.MaskIndex.SOURCE;
                        feature.emit('sourceChanged', self._source);
                        feature.makeDirty();
                    };
                    img.src = imageb64;
                });
            }
            break;
    }
};

C.Helpers.RendererHelper.Image.crop = function (feature, crop) {
    var img = new C.Geo.Feature.Image({
        location: feature._location,
        width: feature._width,
        height: feature._height,
        anchorX: feature._anchorX,
        anchorY: feature._anchorY
    });

    img.__texture = new PIXI.Texture(feature.__texture, crop);
    return img;
};

C.Helpers.RendererHelper.Image.copy = function (feature) {

    var img = new C.Geo.Feature.Image({
        location: feature._location,
        width: feature._width,
        height: feature._height,
        anchorX: feature._anchorX,
        anchorY: feature._anchorY
    });

    img.__texture = new PIXI.Texture(feature.__texture);
    return (img);
};
