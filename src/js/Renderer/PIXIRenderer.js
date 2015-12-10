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

    feature.__graphics.mousedown = feature.__graphics.touchstart = function (event) { feature.__mousedown(event); };
    feature.__graphics.mousemove = feature.__graphics.touchmove = function (event) { feature.__mousemove(event); };
    feature.__graphics.mouseup = feature.__graphics.touchend = function (event) { feature.__mouseup(event); };
    feature.__graphics.click = feature.__graphics.tap = function (event) { feature.__click(event); };
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

    if (feature.__graphics) {
        feature.__graphics.text = feature._text;
    }

    var g = feature.__graphics = feature.__graphics || new PIXI.Text(feature._text, options);

    if (feature._anchor) {
        g.anchor = new PIXI.Point(feature._anchor[0], feature._anchor[1]);
    }
    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    g.position = new PIXI.Point(Math.round(position.X + 0.5), Math.round(position.Y + 0.5));
    if (feature._offset) {
        feature.__graphics.position.x += feature._offset.X;
        feature.__graphics.position.y += feature._offset.Y;
    }
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
    g.beginFill(feature._color);
    g.drawCircle(0, 0, feature._radius);
    g.endFill();

    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    g.position = new PIXI.Point(position.X, position.Y);
    if (feature._offset) {
        feature.__graphics.position.x += feature._offset.X;
        feature.__graphics.position.y += feature._offset.Y;
    }
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

    if (feature.__graphics && feature.__texture) {
        feature.__graphics.texture = feature.__texture;
    }
    var sprite = feature.__graphics = feature.__graphics || new PIXI.Sprite(feature.__texture);

    if (feature.__texture) {
        feature.__texture.baseTexture.scaleMode = this._scaleModeConvert(feature._scaleMode);
    }

    sprite.width = feature._width;
    sprite.height = feature._height;

    sprite.anchor.x = feature._anchorX;
    sprite.anchor.y = feature._anchorY;

    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    sprite.position = new PIXI.Point(position.X, position.Y);//new PIXI.Point(Math.floor(position.X + 0.5), Math.floor(position.Y + 0.5));

    sprite.width = feature._width /*Math.floor(feature._width + 0.5)*/;
    sprite.height = feature._height /*Math.floor(feature._height + 0.5)*/;

    sprite.rotation = feature._rotation;

    if (feature._offset) {
        feature.__graphics.position.x += feature._offset.X;
        feature.__graphics.position.y += feature._offset.Y;
    }
    feature._dirty = false;
};

C.Renderer.PIXIRenderer.prototype.buildLineHitArea = function (graphicsData)
{
    // TODO OPTIMISE!
    var i = 0;
    if (!graphicsData.currentPath) {
        return;
    }
    var points = graphicsData.currentPath.shape.points;
    if (points.length === 0) { return; }

    var firstPoint = new PIXI.Point(points[0], points[1]);
    var lastPoint = new PIXI.Point(points[points.length - 2], points[points.length - 1]);
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y)
    {
        points = points.slice();
        points.pop();
        points.pop();
        lastPoint = new PIXI.Point(points[points.length - 2], points[points.length - 1]);
        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;
        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    var verts = [];
    var indices = [];
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = 0;
    var width = graphicsData.lineWidth / 2;
    var px, py, p1x, p1y, p2x, p2y, p3x, p3y;
    var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
    var a1, b1, c1, a2, b2, c2;
    var denom, pdist, dist;
    p1x = points[0];
    p1y = points[1];
    p2x = points[2];
    p2y = points[3];

    perpx = -(p1y - p2y);
    perpy =  p1x - p2x;

    dist = Math.sqrt(perpx*perpx + perpy*perpy);

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    verts.push(p1x - perpx , p1y - perpy);
    verts.push(p1x + perpx , p1y + perpy);

    for (i = 1; i < length-1; i++)
    {
        p1x = points[(i-1)*2];
        p1y = points[(i-1)*2 + 1];

        p2x = points[(i)*2];
        p2y = points[(i)*2 + 1];

        p3x = points[(i+1)*2];
        p3y = points[(i+1)*2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx*perpx + perpy*perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;

        dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;

        a1 = (-perpy + p1y) - (-perpy + p2y);
        b1 = (-perpx + p2x) - (-perpx + p1x);
        c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        a2 = (-perp2y + p3y) - (-perp2y + p2y);
        b2 = (-perp2x + p2x) - (-perp2x + p3x);
        c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

        denom = a1*b2 - a2*b1;

        if (Math.abs(denom) < 0.1 )
        {

            denom+=10.1;
            verts.push(p2x - perpx , p2y - perpy);

            verts.push(p2x + perpx , p2y + perpy);

            continue;
        }

        px = (b1*c2 - b2*c1)/denom;
        py = (a2*c1 - a1*c2)/denom;


        pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);


        if (pdist > 140 * 140)
        {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;

            dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;

            verts.push(p2x - perp3x, p2y -perp3y);
            verts.push(p2x + perp3x, p2y +perp3y);
            verts.push(p2x - perp3x, p2y -perp3y);
            indexCount++;
        }
        else
        {
            verts.push(px , py);
            verts.push(p2x - (px-p2x), p2y - (py - p2y));
        }
    }

    p1x = points[(length-2)*2];
    p1y = points[(length-2)*2 + 1];

    p2x = points[(length-1)*2];
    p2y = points[(length-1)*2 + 1];

    perpx = -(p1y - p2y);
    perpy = p1x - p2x;

    dist = Math.sqrt(perpx*perpx + perpy*perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(p2x - perpx , p2y - perpy);
    verts.push(p2x + perpx , p2y + perpy);

    var orderedVerts = [];
    for (var i = 0; i < verts.length; i += 4) {
        orderedVerts.push(verts[i], verts[i+1]);
    }
    for (var i = verts.length-1; i >= 0; i -= 4) {
        orderedVerts.push(verts[i-1], verts[i]);
    }

    return new PIXI.Polygon(orderedVerts);
};

/*
**
**  Render Line
**
*/
C.Renderer.PIXIRenderer.prototype.renderLine = function (feature, layer) {

    'use strict';

    if (feature._locationChanged) {
        feature.__locations = [];
        for (var i = 0; i < feature._locations.length; ++i) {
            feature.__locations.push(C.Helpers.CoordinatesHelper.TransformTo(feature._locations[i], this._viewport._schema._crs));
        }
        feature._locationChanged = false;
    }

    var g = feature.__graphics = feature.__graphics || new PIXI.Graphics();

    g.clear();
    g.lineStyle(feature._width, feature._color);

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
    if (feature._offset) {
        feature.__graphics.position.x += feature._offset.X;
        feature.__graphics.position.y += feature._offset.Y;
    }
    feature._dirty = false;
    feature.__graphics.hitArea = this.buildLineHitArea(feature.__graphics);
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
    if (feature._color >= 0) {
        g.beginFill(feature._color);
    }

    var origin;
    var points = [];
    for (var i = 0; i < feature.__locations.length; ++i) {
        var loc = feature.__locations[i];
        var pt = this._viewport.worldToScreen(loc.X, loc.Y);
        if (i === 0) {
            origin = pt;
            points.push(0, 0);
            g.position = new PIXI.Point(origin.X, origin.Y);
            continue;
        }
        points.push(pt.X - origin.X, pt.Y - origin.Y);
    }
    g.drawPolygon(points);
    g.endFill();
    if (feature._offset) {
        feature.__graphics.position.x += feature._offset.X;
        feature.__graphics.position.y += feature._offset.Y;
    }
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
        if (feature.__graphics) {
            feature.__graphics.alpha = feature._opacity;
        }
        feature._mask -= C.Geo.Feature.Feature.OpacityMask;
        if (feature._mask == 0)
            return;
    }
    if ((feature._mask & C.Geo.Feature.Feature.InteractiveMask) != 0) {
        if (feature.__graphics) {
            feature.__graphics.interactive = feature._interactive;
        }
        feature._mask -= C.Geo.Feature.Feature.InteractiveMask;
        if (feature._mask == 0)
            return;
    }
    if ((feature._mask & C.Geo.Feature.Feature.OffsetMask) != 0) {
        if (feature.__graphics) {
            this.updateFeaturePosition(feature);
        }
        feature._mask -= C.Geo.Feature.Feature.OffsetMask;
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
        feature.__graphics.position.x = Math.round(position.X + 0.5);
        feature.__graphics.position.y = Math.round(position.Y + 0.5);
        if (feature._offset) {
            feature.__graphics.position.x += feature._offset.X;
            feature.__graphics.position.y += feature._offset.Y;
        }
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

    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.LOCATION) != 0) {
        feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        feature.__graphics.position.x = position.X;
        feature.__graphics.position.y = position.Y;
        if (feature._offset) {
            feature.__graphics.position.x += feature._offset.X;
            feature.__graphics.position.y += feature._offset.Y;
        }

        //        feature.__graphics.position.x = Math.floor(feature.__graphics.position.x + 0.5);
        //        feature.__graphics.position.y = Math.floor(feature.__graphics.position.y + 0.5);
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.SOURCE) != 0) {
        feature.__graphics.texture = feature.__texture;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.WIDTH;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.HEIGHT;
        feature._mask |= C.Geo.Feature.Image.MaskIndex.SCALEMODE;
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.WIDTH) != 0) {
        feature.__graphics.width = feature._width;
        //        feature.__graphics.width = Math.floor(feature._width + 0.5);
    }
    if ((feature._mask & C.Geo.Feature.Image.MaskIndex.HEIGHT) != 0) {
        feature.__graphics.height = feature._height;
        //        feature.__graphics.height = Math.floor(feature._height + 0.5);
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

C.Renderer.PIXIRenderer.prototype.updateFeaturePosition = function (feature, direction) {

    'use strict';

    if (feature.__location !== undefined) { // Circle,Image,Text
        var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
        if (feature._type == C.Geo.Feature.Feature.FeatureType.TEXT) {
            feature.__graphics.position.x = Math.round(position.X + 0.5);
            feature.__graphics.position.y = Math.round(position.Y + 0.5);
        } else {
            feature.__graphics.position.x = position.X;
            feature.__graphics.position.y = position.Y;
        }
        if (feature._offset) {
            feature.__graphics.position.x += feature._offset.X;
            feature.__graphics.position.y += feature._offset.Y;
        }
        return;
    }
    if (feature.__locations !== undefined) { // Line,Polygon
        switch (feature._type) {
            case C.Geo.Feature.Feature.FeatureType.LINE:
                this.renderLine(feature);
                break;
            case C.Geo.Feature.Feature.FeatureType.POLYGON:
                if (direction == C.System.Viewport.zoomDirection.NONE && !feature._locationChanged && feature.__locations.length > 0) {
                    var loc = feature.__locations[0];
                    var pt = this._viewport.worldToScreen(loc.X, loc.Y);
                    feature.__graphics.position = new PIXI.Point(pt.X, pt.Y);
                    if (feature._offset) {
                        feature.__graphics.position.x += feature._offset.X;
                        feature.__graphics.position.y += feature._offset.Y;
                    }
                } else {
                    this.renderPolygon(feature);
                }
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

///////////////////////
//  UPDATE POSITIONS //
///////////////////////
C.Renderer.PIXIRenderer.prototype.layerUpdatePositions = function (features, direction) {
//    var features = layer._features;
    for (var k = 0; k < features.length; ++k) {
        var feature = features[k];
        if (feature._features) {
            this.layerUpdatePositions(feature._features, direction);
        } else {
            this.updateFeaturePosition(feature, direction);
        }
    }
};

C.Renderer.PIXIRenderer.prototype.updatePositions = function (direction) {

    'use strict';

    var self = this;

//    function it_layer(layer) {
//        var features = layer._features;
//        for (var k = 0; k < features.length; ++k) {
//            var feature = features[k];
//            if (feature._features) {
//                it_layer(feature);
//            } else {
//                self.updateFeaturePosition(feature, direction);
//            }
//        }
//    }

    var layers = this._layerManager._layers;
    for (var i = 0; i < layers.length; ++i) {
        this.layerUpdatePositions(layers[i]._features, direction);
//        it_layer(layers[i]);
    }
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

                if (resources.image.error) {
                    return;
                }
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

                    var cache = feature._context._resources.get(feature._source);

                    if (cache) {
                        feature.__texture = new PIXI.Texture(new PIXI.BaseTexture(cache, C.Renderer.PIXIRenderer.scaleModeConvert(feature._scaleMode)));
                        feature.emit('loaded', self);
                        feature._mask |= C.Geo.Feature.Image.MaskIndex.SOURCE;
                        feature.emit('sourceChanged', self._source);
                        feature.makeDirty();
                    } else {
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
                        feature._context._resources.set(feature._source, img);
                    }
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
    if (crop.x >= 0.0 && crop.width <= 1.0) {
        crop.x = crop.x * feature.__texture._frame.width;
        crop.width = crop.width * feature.__texture._frame.width;
    }
    if (crop.y >= 0.0 && crop.height <= 1.0) {
        crop.y = crop.y * feature.__texture._frame.height;
        crop.height = crop.height * feature.__texture._frame.height;
    }
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
