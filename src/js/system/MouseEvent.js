/*
 *  MouseEvent.js   wraps an original mouse event to add easy to use function
 */

/**
 * Wraps an original event
 *
 * @class MouseEvent
 * @namespace C
 */
C.System.MouseEvent = function (originalEvent) {

    this.originalEvent = originalEvent;

    this._isPrevented = false;
};

/**
 * Prevent event from going further in CitronGIS
 *
 * @method preventDefault
 * @public
 */
C.System.MouseEvent.prototype.preventDefault = function () {
    this._isPrevented = true;
};

/**
 * Returns a C.Point at the current mouse/tap position
 *
 * @method getWorldPosition
 * @public
 * @return {C.Point} Current location at the event.
 */
C.System.MouseEvent.prototype.getWorldPosition = function () {
    if (this.worldPosition) { return this.worldPosition; }
    var worldPt = C.Helpers.viewport.screenToWorld(this.originalEvent.X, this.originalEvent.Y);
    this.worldPosition = new C.Geometry.Point(worldPt.X, worldPt.Y, 0, C.Helpers.viewport._schema._crs);
    return this.worldPosition;
};
