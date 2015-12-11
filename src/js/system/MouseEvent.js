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
 * Stops event from going further (z-index wise)
 *
 * @method preventDefault
 * @public
 */
C.System.MouseEvent.prototype.stopPropagation = function () {
    if (this.originalEvent.stopPropagation) {
        this.originalEvent.stopPropagation();
    }
    if (this.originalEvent.data) {
        this.originalEvent.data.originalEvent.stopPropagation();
    }
};

/**
 * Prevent event from going further in CitronGIS
 *
 * @method preventDefault
 * @public
 */
C.System.MouseEvent.prototype.preventDefault = function () {
    this._isPrevented = true;
    if (this.originalEvent.data) {
        this.originalEvent.data.originalEvent.preventDefault();
    }
};

/**
 * Returns a C.Point at the current mouse/tap position
 *
 * @method getWorldPosition
 * @public
 * @return {C.Point} Current location at the event.
 */
C.System.MouseEvent.prototype.getWorldPosition = function () {
    if (!this.worldPosition) {
        var x = (this.originalEvent.data && this.originalEvent.data.global) ?
            (this.originalEvent.data.global.x) : (this.originalEvent.X);
        var y = (this.originalEvent.data && this.originalEvent.data.global) ?
            (this.originalEvent.data.global.y) : (this.originalEvent.Y);
        var worldPt = C.Helpers.viewport.screenToWorld(x, y);
        this.worldPosition = new C.Geometry.Point(worldPt.X, worldPt.Y, 0, C.Helpers.viewport._schema._crs);
    }
    return this.worldPosition;
};

/**
 * Returns a C.Vector2 at the current mouse/tap position
 *
 * @method getScreenPosition
 * @public
 * @return {C.Vector2} Current location at the event.
 */
C.System.MouseEvent.prototype.getScreenPosition = function () {
    if (!this.screenPosition) {
        var x = (this.originalEvent.data && this.originalEvent.data.global) ?
            (this.originalEvent.data.global.x) : (this.originalEvent.X);
        var y = (this.originalEvent.data && this.originalEvent.data.global) ?
            (this.originalEvent.data.global.y) : (this.originalEvent.Y);
        this.screenPosition = new C.Geometry.Vector2(x, y);
    }
    return this.screenPosition;
};
