/*
**
**  Image.js
**
**  Author citolen
**  Created 24/12/2014
**
*/

var C = C || {};
C.Geo = C.Geo || {};
C.Geo.Feature = C.Geo.Feature || {};

C.Geo.Feature.Image = C.Utils.Inherit(function (base, options) {

    'use strict';

    base(C.Geo.Feature.Feature.FeatureType.IMAGE);

    if (options === undefined || options.location === undefined) throw 'Invalid Argument';

    this._location = options.location;

    this._source = options.source || undefined;

    this._width = options.width || 42;

    this._height = options.height || 42;

    /*this._offsetX = options.offsetX || 0;

    this._offsetY = options.offsetY || 0;*/

    this._anchorX = options.anchorX || 0;

    this._anchorY = options.anchorY || 0;
}, C.Geo.Feature.Feature, 'C.Geo.Feature.Image');

C.Geo.Feature.Image.MaskIndex = {
    LOCATION: 1,
    SOURCE: 2,
    WIDTH: 4,
    HEIGHT: 8,
    ANCHORX: 16,
    ANCHORY: 32
};

C.Geo.Feature.Image.prototype.location = function (location) {

    'use strict';

    if (location === undefined || this._location === location) return this._location;

    this._location = location;
    this._mask |= C.Geo.Feature.Image.MaskIndex.LOCATION;
    this.emit('locationChanged', location);
    this.makeDirty();
    return this._location;
};

C.Geo.Feature.Image.prototype.source = function (source) {

    'use strict';

    if (source === undefined || this._source === source) return this._source;

    this._source = source;
    this._mask |= C.Geo.Feature.Image.MaskIndex.SOURCE;
    this.emit('sourceChanged', source);
    this.makeDirty();
    return this._source;
};

C.Geo.Feature.Image.prototype.width = function (width) {

    'use strict';

    if (width === undefined || this._width === width) return this._width;

    this._width = width;
    this._mask |= C.Geo.Feature.Image.MaskIndex.WIDTH;
    this.emit('widthChanged', width);
    this.makeDirty();
    return this._width;
};

C.Geo.Feature.Image.prototype.height = function (height) {

    'use strict';

    if (height === undefined || this._height === height) return this._height;

    this._height = height;
    this._mask |= C.Geo.Feature.Image.MaskIndex.HEIGHT;
    this.emit('heightChanged', height);
    this.makeDirty();
    return this._height;
};

/*C.Geo.Feature.Image.prototype.offsetX = function (offsetX) {

    'use strict';

    if (offsetX === undefined || this._offsetX === offsetX) return this._offsetX;

    this._offsetX = offsetX;
    this.emit('offsetXChanged', offsetX);
    this.makeDirty();
    return this._offsetX;
};

C.Geo.Feature.Image.prototype.offsetY = function (offsetY) {

    'use strict';

    if (offsetY === undefined || this._offsetY === offsetY) return this._offsetY;

    this._offsetY = offsetY;
    this.emit('offsetYChanged', offsetY);
    this.makeDirty();
    return this._offsetY;
};*/

C.Geo.Feature.Image.prototype.anchorX = function (anchorX) {

    'use strict';

    if (anchorX === undefined || this._anchorX === anchorX) return this._anchorX;

    this._anchorX = anchorX;
    this._mask |= C.Geo.Feature.Image.MaskIndex.ANCHORX;
    this.emit('anchorXChanged', anchorX);
    this.makeDirty();
    return this._anchorX;
};

C.Geo.Feature.Image.prototype.anchorY = function (anchorY) {

    'use strict';

    if (anchorY === undefined || this._anchorY === anchorY) return this._anchorY;

    this._anchorY = anchorY;
    this._mask |= C.Geo.Feature.Image.MaskIndex.ANCHORY;
    this.emit('anchorYChanged', anchorY);
    this.makeDirty();
    return this._anchorY;
};
