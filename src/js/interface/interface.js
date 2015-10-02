/*
 *  interface.js    //TODO description
 */

var C = C || {};

C.Interface = function () {

    this._root;
    this._container;
    this._grid;

};

C.Interface.prototype.init = function (root) {
    this._root = root;
    this._container = document.createElement('div');
    this._container.className = 'citrongis-interface';
    this._root.appendChild(this._container);

    this._grid = new C.Interface.Grid(this._container);

    var blocktest = new C.Interface.ButtonBlock({
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '+',
        css: {
            borderRadius: '4px 4px 0px 0px',
            fontWeight: 'bold'
        }
    });
    this._grid.addBlock(blocktest);
    var blocktest1 = new C.Interface.ButtonBlock({
        x: 1,
        y: 2,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '-',
        css: {
            borderRadius: '0px 0px 4px 4px',
            borderTop: 'none',
            fontWeight: 'bold'
        }
    });
    this._grid.addBlock(blocktest1);

    blocktest.on('click', function () {
        C.System.Events.zoomInWithAnimation();
    });
    blocktest1.on('click', function () {
        C.System.Events.zoomOutWithAnimation();
    });
};

C.Interface.prototype.resize = function (width, height) {

    this._grid.resize(width, height);

};

C.Interface = new C.Interface();
