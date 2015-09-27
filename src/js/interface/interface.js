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
        y: 0,
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
        y: 1,
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
    var blocklogIn = new C.Interface.ButtonBlock({
        x: 3,
        y: 0,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '<img src="../../src/css/img/menu_user.png" style="height: 75%"/>',
        css: {
            borderRadius: '4px 0px 0px 4px',
            borderBottom: 'solid 5px #3498db',
            fontWeight: 'bold',
            boxShadow: 'none',
            position: 'absolute'
        }
    });
    this._grid.addBlock(blocklogIn);
    var blockStore = new C.Interface.ButtonBlock({
        x: 4,
        y: 0,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '<img src="../../src/css/img/menu_bag.png" style="height: 75%"/>',
        css: {
            borderRadius: '0px 0px 0px 0px',
            borderBottom: 'solid 5px #2ecc71',
            fontWeight: 'bold',
            boxShadow: 'none'
        }
    });
    this._grid.addBlock(blockStore);
    var blockSettings = new C.Interface.ButtonBlock({
        x: 5,
        y: 0,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '<img src="../../src/css/img/menu_settings.png" style="height: 75%"/>',
        css: {
            borderRadius: '0px 0px 0px 0px',
            borderBottom: 'solid 5px #e67e22',
            fontWeight: 'bold',
            boxShadow: 'none'
        }
    });
    this._grid.addBlock(blockSettings);
    var blockSearch = new C.Interface.ButtonBlock({
        x: 6,
        y: 0,
        width: 1,
        height: 1,
        float: C.Interface.BlockFloat.topLeft,
        content: '<img src="../../src/css/img/menu_search.png" style="height: 75%"/>',
        css: {
            borderRadius: '0px 4px 4px 0px',
            borderBottom: 'solid 5px #f1c40f',
            fontWeight: 'bold',
            boxShadow: 'none'
        }
    });
    this._grid.addBlock(blockSearch);



    var windowUser = new C.Interface.WindowBlock({
        x: blocklogIn.getX(),
        y: blocklogIn.getY() + 1,
        width: 4,
        height: 4,
        float: C.Interface.BlockFloat.topLeft,
        content: '<user-citrongis></user-citrongis>',
        css: {
            borderRadius: '4px 4px 4px 4px',
            borderBottom: 'solid 5px #3498db',
            fontWeight: 'bold',
            boxShadow: 'none',
            display: 'none'
        }
    });
    this._grid.addBlock(windowUser);



    blocktest.on('click', function () {
        C.System.Events.zoomInWithAnimation();
    });
    blocktest1.on('click', function () {
        C.System.Events.zoomOutWithAnimation();
    });
    blocklogIn.on('click', function() {
        console.log(windowUser.isVisble());
        if (windowUser.isVisble() == false) {
            blocklogIn.setCSS('backgroundColor', '#3498db');
            windowUser.setCSS('display', 'block');
        }
        else {
            blocklogIn.setCSS('backgroundColor', '');
            windowUser.setCSS('display', 'none');
        }
        windowUser._applyCss();
    });
};

C.Interface.prototype.resize = function (width, height) {

    this._grid.resize(width, height);

};

C.Interface = new C.Interface();
