/*
 *  block.js    //TODO description
 */

var C = C || {};

C.Interface.BlockFloat = {
    topLeft: 0,
    topRight: 1,
    bottomLeft: 2,
    bottomRight: 3
};

C.Interface.Block = C.Utils.Inherit(function (base, options) {

    base();

    options = options || {};

    this._x = options.x;
    this._y = options.y;
    this._width = options.width;
    this._height = options.height;
    this._float = options.float || C.Interface.BlockFloat.topLeft;
    this._css = options.css || {};

    this._container = document.createElement('div');
    this._container.className = 'grid-block';

    this._contentContainer = document.createElement('div');
    this._contentContainer.className = 'grid-block-content';
    this._contentContainer.innerHTML = options.content;
    this._container.appendChild(this._contentContainer);

    this._applyCss();
}, EventEmitter, 'C.Interface.Block');

C.Interface.Block.prototype._applyCss = function () {
    for (var key in this._css) {
        this._container.style[key] = this._css[key];
    }
};
C.Interface.Block.prototype.setCSS = function (key, value) {
    this._css[key] = value;
    this._container.style[key] = value;
}

C.Interface.Block.prototype.getX = function () {
    return (this._x);
}

C.Interface.Block.prototype.getY = function () {
    return (this._y);
}

C.Interface.Block.prototype.isVisble = function () {
    if (this._css['display'] == 'none') {
        return (false);
    }
    return (true);
}

C.Interface.Block.prototype.setContent = function (content) {
    this._contentContainer.innerHTML = content;
};
