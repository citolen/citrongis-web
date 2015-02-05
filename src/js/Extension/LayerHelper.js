/*
**
**  LayerHelper.js
**
**  Author citolen
**  27/12/2014
**
*/

var C = C || {};
C.Extension = C.Extension || {};

C.Extension.LayerHelper = function (layerManager, owner) {

    'use strict';

    this._owner = owner;

    this._manager = layerManager;

    this.groups = this._manager.groups.bind(this._manager, this._owner);

    this.createGroup = this._manager.createGroup.bind(this._manager, this._owner);

    this.deleteGroup = this._manager.createGroup.bind(this._manager, this._owner);

    this.createLayer = (function (option) {
        option = option || {};
        option.owner = this._owner;
        return (new C.Geo.Layer(option));
    }).bind(this);
};
