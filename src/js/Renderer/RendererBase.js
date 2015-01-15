/*
**
**  RendererBase.js
**
**  Author citolen
**  13/01/2015
**
*/

var C = C || {};
C.Renderer = C.Renderer || {};

C.Renderer.RendererBase = function (citronGIS) {

    'use strict';

    if (!citronGIS) return;

    this._layerManager = citronGIS._layerManager;

    this._stage = citronGIS._rendererStage;

    this._viewport = citronGIS._viewport;

    this._layerManager.on('featureChange', this.featureChange.bind(this));

    this._layerManager.on('layerChange', this.layerChange.bind(this));

    this._layerManager.on('groupChange', this.groupChange.bind(this));
};

C.Renderer.RendererBase.prototype.featureChange = function (eventType, feature, layer) {

    'use strict';

    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.layerChange = function (eventType, layer) {

    'use strict';

    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.groupChange = function (eventType, group) {

    'use strict';

    throw 'ToImplement';
};

C.Renderer.RendererBase.prototype.updatePositions = function () {

    'use strict';

    throw 'ToImplement';
};
