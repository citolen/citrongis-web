/*
 *  grid.js //TODO description
 */

var C = C || {};

C.Interface.Grid = function (container) {

    this._container = container;
    this._width = $(this._container).width();
    this._height = $(this._container).height();
    this.calculateGridSize();

    this._blocks = [];
//    this.displayEditGrid();
};

C.Interface.Grid.prototype.calculateGridSize = function () {
    this._gridSize = 30;
    var horizontalMargin = (this._width % this._gridSize);
    var horizontalCount = Math.floor((this._width - horizontalMargin) / this._gridSize);
    this._horizontalMargin = (this._width - (horizontalCount * this._gridSize)) / 2;
    var verticalMargin = (this._height % this._gridSize);
    var verticalCount = Math.floor((this._height - verticalMargin) / this._gridSize);
    this._verticalMargin = (this._height - (verticalCount * this._gridSize)) / 2;
};

C.Interface.Grid.prototype.gridInWidth = function () {
    return (this._width - (this._horizontalMargin * 2)) / this._gridSize;
};

C.Interface.Grid.prototype.gridInHeight = function () {
    return (this._height - (this._verticalMargin * 2)) / this._gridSize;
};

C.Interface.Grid.prototype.displayEditGrid = function () {

    this._editBlocks = [];
    var gridWidth = this.gridInWidth();
    var gridHeight = this.gridInHeight();

    for (var y = 0; y < gridHeight; ++y) {
        for (var x = 0; x < gridWidth; ++x) {

            var block = document.createElement('div');
            block.className = 'grid-edit-block';
            block.style.width = this._gridSize;
            block.style.height = this._gridSize;
            block.style.top = (this._verticalMargin) + y * this._gridSize;
            block.style.left = this._horizontalMargin + x * this._gridSize;
            this._container.appendChild(block);
            this._editBlocks.push(block);

        }
    }
};

C.Interface.Grid.prototype.clearEditGrid = function () {
    for (var i = 0; i < this._editBlocks.length; ++i) {
        this._container.removeChild(this._editBlocks[i]);
    }
    delete this._editBlocks;
};

C.Interface.Grid.prototype.resize = function (width, height) {
    this._width = width;
    this._height = height;

    this.calculateGridSize();
    if (this._editBlocks) {
        this.clearEditGrid();
        this.displayEditGrid();
    }
    this.placeAllBlocks();
};

C.Interface.Grid.prototype.addBlock = function (block) {

    this._blocks.push(block);
    this._container.appendChild(block._container);
    this._placeBlock(block);

};

C.Interface.Grid.prototype._placeBlock = function (block) {

    var x;
    if (block._float == C.Interface.BlockFloat.topLeft || block._float == C.Interface.BlockFloat.bottomLeft) {
        x = this._horizontalMargin + block._x * this._gridSize;
    } else {
        x = this._width - (this._horizontalMargin + block._x * this._gridSize + block._width * this._gridSize);
    }
    var y;
    if (block._float == C.Interface.BlockFloat.topLeft || block._float == C.Interface.BlockFloat.topRight) {
        y = this._verticalMargin + block._y * this._gridSize;
    } else {
        y = this._height - (this._verticalMargin + block._y * this._gridSize + block._height * this._gridSize);
    }
    block._container.style.top = y;
    block._container.style.left = x;
    block._container.style.width = block._width * this._gridSize;
    block._container.style.height = block._height * this._gridSize;

};

C.Interface.Grid.prototype.placeAllBlocks = function () {
    for (var i = 0; i < this._blocks.length; ++i) {
        this._placeBlock(this._blocks[i]);
    }
};
