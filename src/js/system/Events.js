/*
 *  C.System.Events //TODO description
 *  Inertia from Leaflet (https://github.com/Leaflet/Leaflet/)
 */

//'use strict';

//TODO make an interface out of it so that each plateform can use their own events

/**
 * Manage all the map events
 *
 * @class Events
 * @namespace C
 * @extends EventEmitter
 */
C.System.Events = new (C.Utils.Inherit(function () {

    this._isDown = false;
    this._hasMoved= false;
    this._isPrevented = false;
    this._lastX= undefined;
    this._lastY= undefined;
    this._movedTimeout= 200;

    this._velocityX = 0;
    this._velocityY = 0;
    this._lastTime;

    this._wheel = 0;
    this._wheelDelta = 0;
    this._wheelTrigger= 3;
    this._wheelTimer;
    this._resolutionTarget= 0;
    this._resolutionStep= 0;
    this._wheeldX= 0;
    this._wheeldY= 0;
    this._zoomAnimation= undefined;
    this._zoomStep= 10;
    this._zoomStepDuration= 16;

    this._currentAnimation;

}, EventEmitter, 'C.System.Events'))();

C.System.Events.attach = function (citronGIS) {
    //TODO debug
    //console.log('setup event');

    this._citronGIS = citronGIS;

    /*
     *  Panning/Click
     */
    document.addEventListener('mousedown', C.System.Events.stageDown.bind(this));
    document.addEventListener('mousemove', C.System.Events.stageMove.bind(this));
    document.addEventListener('mouseup', C.System.Events.stageUp.bind(this));
    document.addEventListener('touchstart', C.System.Events.stageDown.bind(this));
    document.addEventListener('touchmove', C.System.Events.stageMove.bind(this));
    document.addEventListener('touchend', C.System.Events.stageUp.bind(this));
    document.addEventListener('dblclick', C.System.Events.stageDblClick.bind(this));

    this._citronGIS._renderer.view.addEventListener('wheel', C.System.Events.wheel.bind(this));

    document.addEventListener('touchstart', C.System.Events.touchStart.bind(this));
    this._touchMove = C.System.Events.touchMove.bind(this);
    this._touchEnd = C.System.Events.touchEnd.bind(this);

    //    var handleTouchyPinch = function (e, $target, data) {
    //        var val = data.scale;
    //        if (val < 1) {
    //            val = 1 + (1 - val);
    //            var res = C.Helpers.viewport._resolution;
    //            var zoomLevel = C.Helpers.viewport.getZoomLevel();
    //            var minZoomLevel = 0;
    //            if (zoomLevel > minZoomLevel) {
    //                var diff = C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel - 1) - C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel);
    //                C.Helpers.viewport.zoom(res + diff / 30 * val);
    //            }
    //        } else {
    //            var res = C.Helpers.viewport._resolution;
    //            var zoomLevel = C.Helpers.viewport.getZoomLevel();
    //            var maxZoomLevel = C.Helpers.viewport.getMaxZoomLevel();
    //            if (zoomLevel < maxZoomLevel) {
    //                var diff = C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel + 1) - C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel);
    //                C.Helpers.viewport.zoom(res + diff / 30 * val);
    //            }
    //        }
    ////        C.Helpers.viewport.zoom(C.Helpers.viewport._resolution + data.scale);
    ////        data.scale;
    //    };
    //    $(this._citronGIS._renderer.view).bind('touchy-pinch', handleTouchyPinch);
    //
    //    this._citronGIS._renderer.view.addEventListener('touchstart', C.System.Events.stageDown.bind(this));
    //    document.addEventListener('touchmove',C.System.Events.stageMove.bind(this));
    //    window.addEventListener('touchend', C.System.Events.stageUp.bind(this));
    $(window).keydown(C.System.Events.keyDown.bind(this));
    //        this._citronGIS._renderer.view.addEventListener('wheel', C.System.Events.wheel.bind(this));

    this._citronGIS._viewport.on('move', C.System.Events.internalUpdate.bind(this));
};

C.System.Events.touchStart = function (e) {
    if ((!e.touches || e.touches.length !== 2) && (!e.changedTouches || e.changedTouches.length !== 2)) { return; }

    console.log('touchStart', arguments);
    var touches = (e.touches) ? (e.touches) : (e.changedTouches);
    var p1 = new C.Geometry.Vector2(touches[0].pageX, touches[0].pageY);
    var p2 = new C.Geometry.Vector2(touches[1].pageX, touches[1].pageY);

    this._startDist = p1.Distance(p2);
    this._startZoom = C.Helpers.viewport.getDecimalZoomLevel();
    console.log(C.Helpers.viewport._resolution, C.Helpers.viewport.getZoomLevel(), this._startZoom);
    this._isDown = false;

    document.addEventListener('touchmove', this._touchMove);
    document.addEventListener('touchend', this._touchEnd);
};

C.System.Events.touchMove = function (e) {
    if ((!e.touches || e.touches.length !== 2) && (!e.changedTouches || e.changedTouches.length !== 2)) { return; }

    console.log('touchMove', arguments);
    var touches = (e.touches) ? (e.touches) : (e.changedTouches);
    var p1 = new C.Geometry.Vector2(touches[0].pageX, touches[0].pageY);
    var p2 = new C.Geometry.Vector2(touches[1].pageX, touches[1].pageY);
    var scale = p1.Distance(p2) / this._startDist;
    var zoom = Math.log((scale * (256 * Math.pow(2, this._startZoom))) / 256) / Math.LN2;

    var px = (p1.X + p2.X) / 2;
    var py = (p1.Y + p2.Y) / 2;
    var dx = px - this._citronGIS._viewport._width / 2;
    var dy = py - this._citronGIS._viewport._height / 2;

    C.Helpers.viewport.translate(-dx, -dy, true);
    C.Helpers.viewport.zoom(C.Helpers.viewport.getResolutionAtZoomLevel(zoom), true);
    C.Helpers.viewport.translate(dx, dy);
};

C.System.Events.touchEnd = function () {
    console.log('touchEnd', arguments);
    document.removeEventListener('touchmove', this._touchMove);
    document.removeEventListener('touchend', this._touchEnd);
    this.emit('zoomend', C.Helpers.viewport);
};

/**
 * Zoom in with an animation
 *
 * @method zoomInWithAnimation
 * @public
 */
C.System.Events.zoomInWithAnimation = function (offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(C.Helpers.viewport._resolution);
    if (this._currentAnimation) {
    } else {
        if (zoomLevel + 1 < C.Helpers.ResolutionHelper.Resolutions.length) {
            var resolutionTarget = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];
            C.System.Events.zoomToWithAnimation(resolutionTarget, offsetX, offsetY);
            ga('send', 'pageview', 'Zoom In');
        }
    }
};

/**
 * Zoom out with an animation
 *
 * @method zoomOutWithAnimation
 * @public
 */
C.System.Events.zoomOutWithAnimation = function () {
    var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(C.Helpers.viewport._resolution);
    if (this._currentAnimation) {
    } else {
        if (zoomLevel - 1 >= 0) {
            var resolutionTarget = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1];
            C.System.Events.zoomToWithAnimation(resolutionTarget, 0, 0);
            ga('send', 'pageview', 'Zoom Out');
        }
    }
};

/**
 * Zoom to bounds
 *
 * @method zoomToBounds
 * @public
 * @param {C.Bounds} bounds Bounds to zoom to.
 */
C.System.Events.zoomToBounds = function (bounds) {

    var crsBounds = bounds.transformTo(C.Helpers.viewport._schema._crs);
    if (!crsBounds) { return; }
    var center = crsBounds.getCenter();
    var width = C.Helpers.viewport._width;
    var height = C.Helpers.viewport._height;
    var boundsWidth = Math.abs (crsBounds._topRight.X - crsBounds._bottomLeft.X);
    var boundsHeight = Math.abs(crsBounds._topRight.Y - crsBounds._bottomLeft.Y);
    var res;
    for (var z = C.Helpers.viewport._schema._resolutions.length-1; z >= 0; --z) {
        var resolution = C.Helpers.viewport._schema._resolutions[z];
        var tw = (width - 50) * resolution;
        var th = (height - 50) * resolution;
        if (tw > boundsWidth && th > boundsHeight) {
            res = resolution;
            break;
        }
    }
    if (!res) {
        res = C.Helpers.viewport._schema._resolutions[0];
    }
    C.System.Events.zoomToCenterWithAnimation(res, center);
};

/**
 * A zoom animation reach its end
 * @event zoomend
 * @param {C.Viewport} viewport
 */
C.System.Events.zoomToCenterWithAnimation = function (targetResolution, center) {
    var resolution = C.Helpers.viewport._resolution;
    var deltaResolution = targetResolution - C.Helpers.viewport._resolution;
    var deltaCenterX = center.X - C.Helpers.viewport._origin.X;
    var deltaCenterY = center.Y - C.Helpers.viewport._origin.Y;
    var step = deltaResolution / 15;
    var stepCenterX = deltaCenterX / 15;
    var stepCenterY = deltaCenterY / 15;
    var originalCenter = new C.Geometry.Vector2(C.Helpers.viewport._origin.X, C.Helpers.viewport._origin.Y);
    var animationSpeed = 15;
    var self = this;

    if (this._currentAnimation) { clearTimeout(this._currentAnimation); }

    var steps = 0;
    this._currentAnimation = setTimeout(function zoomAnimation() {
        ++steps;
        resolution += step;
        originalCenter.X += stepCenterX;
        originalCenter.Y += stepCenterY;


        if (steps <= 15) {
            C.Helpers.viewport.setCenter(originalCenter, true)
            C.Helpers.viewport.zoom(resolution);
            self._currentAnimation = setTimeout(zoomAnimation, animationSpeed);
        } else {
            self._currentAnimation = undefined;
            C.Helpers.viewport.setCenter(center, true);
            C.Helpers.viewport.zoom(targetResolution);
            self.emit('zoomend', C.Helpers.viewport);
        }
    }, animationSpeed);
};

/**
 * A zoom animation reach its end
 * @event zoomend
 * @param {C.Viewport} viewport
 */
C.System.Events.zoomToWithAnimation = function (targetResolution, offsetX, offsetY) {
    var resolution = C.Helpers.viewport._resolution;
    var deltaResolution = targetResolution - C.Helpers.viewport._resolution;
    var step = deltaResolution / 15;
    var animationSpeed = 15;
    var self = this;
    var self = this;

    if (this._currentAnimation) { clearTimeout(this._currentAnimation); }

    this._currentAnimation = setTimeout(function zoomAnimation() {
        resolution += step;

        if (step < 0 && resolution > targetResolution ||
            step > 0 && resolution < targetResolution) {
            C.Helpers.viewport.translate(-offsetX, -offsetY, true);
            C.Helpers.viewport.zoom(resolution, true);
            C.Helpers.viewport.translate(offsetX, offsetY);
            self._currentAnimation = setTimeout(zoomAnimation, animationSpeed);
        } else {
            self._currentAnimation = undefined;
            C.Helpers.viewport.translate(-offsetX, -offsetY, true);
            C.Helpers.viewport.zoom(targetResolution, true);
            C.Helpers.viewport.translate(offsetX, offsetY);
            self.emit('zoomend', C.Helpers.viewport);
        }
    }, animationSpeed);
};

C.System.Events.animateZoom = function () {
    var target = this._citronGIS._viewport._resolution + this._resolutionStep;

    this._citronGIS._viewport.translate(-this._wheeldX, -this._wheeldY, true);
    this._citronGIS._viewport.zoom(target, true);
    this._citronGIS._viewport.translate(this._wheeldX, this._wheeldY);

    if (this._resolutionStep < 0 && target > this._resolutionTarget) {
        this._zoomAnimation = setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
    } else if (this._resolutionStep > 0 && target < this._resolutionTarget) {
        this._zoomAnimation = setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
    } else {
        this._zoomAnimation = undefined;
        this._citronGIS._viewport.translate(-this._wheeldX, -this._wheeldY, true);
        this._citronGIS._viewport.zoom(this._resolutionTarget, true);
        this._citronGIS._viewport.translate(this._wheeldX, this._wheeldY);
        this.emit('zoomend', C.Helpers.viewport);
    }
};

C.System.Events.performWheelZoom = function () {
    console.log(this._wheelDelta);
    this._wheelDelta = 0;
}

C.System.Events.wheel = function (evt) {
    if (this._zoomAnimation) { return; }
    if (evt.deltaY > 0) {
        this._wheel += 1;
    } else if (evt.deltaY < 0) {
        this._wheel -= 1;
    }
    this._wheel += evt.deltaY;
    //    console.log(this._wheel);
    if (this._wheel <= -this._wheelTrigger) {
        this._wheel = 0;
        var zoomLevel;
        if (!this._zoomAnimation) {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        } else {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._resolutionTarget);
        }

        if (zoomLevel + 1 < C.Helpers.ResolutionHelper.Resolutions.length) {
            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];

            if (zoomLevel == this._resolutionTarget) {
                return;
            }

            var dx = evt.offsetX - this._citronGIS._viewport._width / 2;
            var dy = evt.offsetY - this._citronGIS._viewport._height / 2;

            this._wheeldX = dx;
            this._wheeldY = dy;

            this._resolutionTarget = zoomLevel;
            this._resolutionStep = (this._resolutionTarget - this._citronGIS._viewport._resolution) / this._zoomStep;

            clearTimeout(this._zoomAnimation);
            setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
        }
    } else if (this._wheel >= this._wheelTrigger) {
        this._wheel = 0;
        var zoomLevel;
        if (!this._zoomAnimation) {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
        } else {
            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._resolutionTarget);
        }
        if (zoomLevel - 1 >= 0) {
            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1];


            if (zoomLevel == this._resolutionTarget) {
                return;
            }

            var dx = evt.offsetX - this._citronGIS._viewport._width / 2;
            var dy = evt.offsetY - this._citronGIS._viewport._height / 2;

            this._wheeldX = dx;
            this._wheeldY = dy;

            this._resolutionTarget = zoomLevel;
            this._resolutionStep = (this._resolutionTarget - this._citronGIS._viewport._resolution) / this._zoomStep;

            clearTimeout(this._zoomAnimation);
            setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
        }
    }
};
//
C.System.Events.keyDown = function (evt) {
    if ((evt.shiftKey && evt.keyCode == 187) ||
        evt.keyCode == 107) /* '+' key */ {
        this.zoomInWithAnimation();
    }
    if ((!evt.shiftKey && evt.keyCode == 54) ||
        (!evt.shiftKey && evt.keyCode == 189) ||
        evt.keyCode == 109)/* '-' key */ {
        this.zoomOutWithAnimation();
    }
    if (evt.keyCode == 106) {
        this._citronGIS._viewport.rotate(-5);
    }
    if (evt.keyCode == 111) {
        this._citronGIS._viewport.rotate(5);
    }
    //    if (evt.keyCode == 107) {
    //        /*var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
    //        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 2]*1*/
    //
    //        var zoomLevel = this._citronGIS._viewport._resolution * 0.9;
    //        if (zoomLevel !== undefined) {
    //            this._citronGIS._viewport.zoom(zoomLevel);
    //        }
    //    }
    //    if (evt.keyCode == 109) {
    //        /*var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
    //        zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1] * 0.85;*/
    //
    //        var zoomLevel = this._citronGIS._viewport._resolution * 1.1;
    //        if (zoomLevel > C.Helpers.ResolutionHelper.Resolutions[0])
    //            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[0];
    //
    //        if (zoomLevel !== undefined) {
    //            this._citronGIS._viewport.zoom(zoomLevel);
    //        }
    //    }
};

//TODO EVENT object to add prevent function to it
//TODO Zoom on double click
/**
 * Map got double clicked
 * @event mapDblClicked
 * @param {C.MouseEvent} e
 */
C.System.Events.stageDblClick = function (e) {
    if (e.target == this._citronGIS._renderer.view) {
        var offset = $(this._citronGIS._rootDiv).offset();
        var px = e.pageX;
        var py = e.pageY;
        if ((!px || !py) && e.changedTouches.length > 0) {
            px = e.changedTouches[0].pageX;
            py = e.changedTouches[0].pageY;
        }
        e.X = px - offset.left;
        e.Y = py - offset.top;
        var evt = new C.System.MouseEvent(e);
        var ret = this.emit('mapDblClicked', evt);
        if (!evt._isPrevented) {
            var offsetX = e.X - this._citronGIS._viewport._width / 2;
            var offsetY = e.Y - this._citronGIS._viewport._height / 2;
            C.System.Events.zoomInWithAnimation(offsetX, offsetY);
        }
    }
};

/**
 * Map mousedown
 * @event mouseDown
 * @param {C.MouseEvent} e
 */
C.System.Events.stageDown = function (e) {
    if ((e.touches && e.touches.length !== 1) || (e.changedTouches && e.changedTouches.length !== 1)) { return; }
    if (e.target == this._citronGIS._renderer.view) {
        var offset = $(this._citronGIS._rootDiv).offset();
        var px = e.pageX;
        var py = e.pageY;
        if ((!px || !py) && e.changedTouches.length > 0) {
            px = e.changedTouches[0].pageX;
            py = e.changedTouches[0].pageY;
        }
        e.X = px - offset.left;
        e.Y = py - offset.top;
        this._isPrevented = false;
        var evt = new C.System.MouseEvent(e);
        this.emit('mouseDown', evt);
        this._isDown = true;
        this._hasMoved = false;
        if (evt._isPrevented) {
            this._isPrevented = true;
            return;
        }
        this._lastX = e.clientX || e.touches[0].pageX;
        this._lastY = e.clientY || e.touches[0].pageY;

        this._lastTime = Date.now();
        this._velocityX = 0;
        this._velocityY = 0;
    }
};

function easeOutQuad(t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
}

/**
 * Map mouseup
 * @event mouseUp
 * @param {C.MouseEvent} e
 */
/**
 * Map got clicked
 * @event mapClicked
 * @param {C.MouseEvent} e
 */
C.System.Events.stageUp = function (e) {
    if (!this._isDown) { return; }

    var offset = $(this._citronGIS._rootDiv).offset();
    var px = e.pageX;
    var py = e.pageY;
    if ((!px || !py) && e.changedTouches.length > 0) {
        px = e.changedTouches[0].pageX;
        py = e.changedTouches[0].pageY;
    }
    e.X = px - offset.left;
    e.Y = py - offset.top;
    this.emit('mouseUp', new C.System.MouseEvent(e));
    this._isDown = false;

    if (!this._hasMoved) {
        this.emit('mapClicked', new C.System.MouseEvent(e));
    }
    if (this._isPrevented) {
        return;
    }


    if (this._velocityX > 0.3 || this._velocityX < -0.3 || this._velocityY > 0.3 || this._velocityY < -0.3) {
        var timeConstant = 400; //ms
        var targetX = (this._velocityX * timeConstant) / 50;
        var targetY = (this._velocityY * timeConstant) / 50;

        this._lastTime = Date.now();
        var self = this;

        function panAnim() {
            if (self._isDown) {
                return;
            }
            var speedX = targetX - easeOutQuad(Date.now() - self._lastTime, 0, 1, timeConstant) * targetX;
            var speedY = targetY - easeOutQuad(Date.now() - self._lastTime, 0, 1, timeConstant) * targetY;
            C.Helpers.viewport.translate(speedX, speedY);

            if (Date.now() - self._lastTime < timeConstant) {
                requestAnimationFrame(panAnim);
            }
        }
        requestAnimationFrame(panAnim);
    }
};

/**
 * Map mousemove
 * @event mouseMove
 * @param {C.MouseEvent} e
 */
C.System.Events.stageMove = function (e) {
    if ((e.touches && e.touches.length !== 1) || (e.changedTouches && e.changedTouches.length !== 1)) { return; }

    var offset = $(this._citronGIS._rootDiv).offset();
    e.X = e.pageX - offset.left;
    e.Y = e.pageY - offset.top;

    this.emit('mouseMove', new C.System.MouseEvent(e));
    if (!this._isDown) { return; }
    if (this._isPrevented) { return; }

    var x = e.clientX || e.touches[0].pageX;
    var y = e.clientY || e.touches[0].pageY;
    var dx = x - this._lastX;
    var dy = y - this._lastY;
    if (dx === 0 && dy === 0) return;

    var elapsed = Date.now() - this._lastTime;
    this._lastTime = Date.now();

    var vx = dx / (1 + elapsed);
    var vy = dy / (1 + elapsed);
    this._velocityX = 0.8 * vx + 0.2 * this._velocityX;
    this._velocityY = 0.8 * vy + 0.2 * this._velocityY;

    this._citronGIS._viewport.translate(dx, dy);
    this._lastX = x;
    this._lastY = y;
    this._hasMoved = true;
};

C.System.Events.internalUpdate = function () {
    this._citronGIS._customRenderer.updatePositions(this._citronGIS._viewport._zoomDirection);
    this._citronGIS._viewport._zoomDirection = C.System.Viewport.zoomDirection.NONE;
};

C.System.Events.renderFrame = function () {
    this.emit('frame');
};

//-------------GAMEPAD-------------

var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

function connecthandler(e) {
    addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;
    console.log(gamepad);
    requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    delete controllers[gamepad.index];
}

var axesThresold = 0.2;

function updateStatus() {
    if (!haveEvents) {
        scangamepads();
    }

    var i = 0;
    var j;

    for (j in controllers) {
        var controller = controllers[j];

        var rightTrigger = controller.buttons[7];
        var leftTrigger = controller.buttons[6];

        if (rightTrigger.pressed) {
            var res = C.Helpers.viewport._resolution;
            var zoomLevel = C.Helpers.viewport.getZoomLevel();
            var maxZoomLevel = C.Helpers.viewport.getMaxZoomLevel();
            if (zoomLevel < maxZoomLevel) {
                var diff = C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel + 1) - C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel);
                C.Helpers.viewport.zoom(res + diff / 10 * rightTrigger.value);
            }
        }
        if (leftTrigger.pressed) {
            var res = C.Helpers.viewport._resolution;
            var zoomLevel = C.Helpers.viewport.getZoomLevel();
            var minZoomLevel = 0;
            if (zoomLevel > minZoomLevel) {
                var diff = C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel - 1) - C.Helpers.viewport.getResolutionAtZoomLevel(zoomLevel);
                C.Helpers.viewport.zoom(res + diff / 10 * leftTrigger.value);
            }
        }

        var axeLeft = new C.Geometry.Vector2(controller.axes[0], controller.axes[1]);
        var axeRight = new C.Geometry.Vector2(controller.axes[2], controller.axes[3]);

        if (Math.abs(axeLeft.X) > axesThresold || Math.abs(axeLeft.Y) > axesThresold) {
            var tx = axeLeft.X * -20;
            var ty = axeLeft.Y * -20;
            C.Helpers.viewport.translate(tx, ty);
        }
    }

    requestAnimationFrame(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (gamepads[i].index in controllers) {
                controllers[gamepads[i].index] = gamepads[i];
            } else {
                addgamepad(gamepads[i]);
            }
        }
    }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
    setInterval(scangamepads, 500);
}
