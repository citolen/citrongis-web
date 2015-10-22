/*
 *  tilelayerblock.js  //TODO description
 */

var C = C || {};

C.Interface.TileLayerBlock = C.Utils.Inherit(function (base, options) {

    base(options);

    this._list = document.createElement('div');

    this._contentContainer.appendChild(this._list);

}, C.Interface.Block, 'C.Interface.TileLayerBlock');

C.Interface.TileLayerBlock.prototype.addTileLayer = function (image_url, name, id) {

    var cont = document.createElement('div');
    var img = document.createElement('img');
    var title = document.createElement('span');

    img.src = image_url;
    title.innerHTML = name;
    cont.appendChild(title);
    cont.appendChild(img);

    cont.style.position = 'relative';
    cont.style.cursor = 'pointer';

    cont.onclick = function (id) {
        this.emit('select', id);
    }.bind(this, id);

    title.style.position = 'absolute';
    title.style.lineHeight = '50px';
    title.style.paddingLeft = '10px';
    title.style.fontFamily = 'Nexa-light';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    title.style.textShadow = '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff';
    this._list.appendChild(cont);
};
