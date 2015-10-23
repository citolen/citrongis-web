/*
 *  MouseEvent.js   wraps an original mouse event to add easy to use function
 */

C.System.MouseEvent = function (originalEvent) {

    this.originalEvent = originalEvent;

};

C.System.MouseEvent.prototype.getWorldPosition = function () {
    if (this.worldPosition) { return this.worldPosition; }
    var worldPt = C.Helpers.viewport.screenToWorld(this.originalEvent.X, this.originalEvent.Y);
    this.worldPosition = new C.Geometry.Point(worldPt.X, worldPt.Y, 0, C.Helpers.viewport._schema._crs);
    return this.worldPosition;
};
