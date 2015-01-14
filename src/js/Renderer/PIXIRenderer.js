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
            this.renderPolygon(feature, layer);
            break;
    }
};

C.Renderer.PIXIRenderer.prototype.renderCircle = function (feature, layer) {

    'use strict';

    feature.__location = C.Helpers.CoordinatesHelper.TransformTo(feature._location, this._viewport._schema._crs);

    feature.__graphics = new PIXI.Graphics();

    feature.__graphics.lineStyle(feature._outlineWidth, feature._outlineColor);
    feature.__graphics.beginFill(feature._backgroundColor);
    feature.__graphics.drawCircle(0, 0, feature._radius);
    feature.__graphics.endFill();

    var position = this._viewport.worldToScreen(feature.__location.X, feature.__location.Y);
    feature.__graphics.position = new PIXI.Point(position.X, position.Y);

    layer.__graphics.addChild(feature.__graphics);
};

C.Renderer.PIXIRenderer.prototype.renderImage = function (feature, layer) {

    'use strict';
};

C.Renderer.PIXIRenderer.prototype.renderLine = function (feature, layer) {

    'use strict';

    if (feature._locations.length < 2) return;

    feature.__locations = [];
    for (var i = 0; i < feature._locations.length; ++i) {
        feature.__locations.push(C.Helpers.CoordinatesHelper.TransformTo(feature._locations[i], this._viewport._schema._crs));
    }

    feature.__graphics = new PIXI.Graphics();

    feature.__graphics.lineStyle(feature._lineWidth, feature._lineColor);
    feature.__graphics.beginFill(feature._lineColor);

    var origin;

    for (var i = 0; i < feature.__locations.length; ++i) {
        var loc = feature.__locations[i];
        var pt = this._viewport.worldToScreen(loc.X, loc.Y);
        if (i === 0) {
            origin = pt;
            feature.__graphics.moveTo(0, 0);
            continue;
        }
        feature.__graphics.lineTo(pt.X - origin.X, pt.Y - origin.Y);
    }
    feature.__graphics.position = new PIXI.Point(origin.X, origin.Y);
    feature.__graphics.endFill();

    layer.__graphics.addChild(feature.__graphics);
};

C.Renderer.PIXIRenderer.prototype.renderPolygon = function (feature, layer) {

    'use strict';
};

C.Renderer.PIXIRenderer.prototype.featureRemoved = function (feature, layer) {

    'use strict';
};

C.Renderer.PIXIRenderer.prototype.featureUpdated = function (feature, layer) {

    'use strict';
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
