/*
 *  C.System.Events //TODO description
 *  Inertia from Leaflet (https://github.com/Leaflet/Leaflet/)
 */

'use strict';

//TODO make an interface out of it so that each plateform can use their own events

C.System.Events = new (C.Utils.Inherit(function () {

    this._isDown = false;
    this._hasMoved= false;
    this._lastX= undefined;
    this._lastY= undefined;
    this._movedTimeout= 500;

    this._velocityX = 0;
    this._velocityY = 0;
    this._lastTime;


    this._wheelDelta = 0;
    this._wheelTrigger= 100;
    this._wheelTimer;
    this._resolutionTarget= 0;
    this._resolutionStep= 0;
    this._wheeldX= 0;
    this._wheeldY= 0;
    this._zoomAnimation= undefined;
    this._zoomStep= 20;
    this._zoomStepDuration= 25;

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

    //
    //    this._citronGIS._renderer.view.addEventListener('touchstart', C.System.Events.stageDown.bind(this));
    //    document.addEventListener('touchmove',C.System.Events.stageMove.bind(this));
    //    window.addEventListener('touchend', C.System.Events.stageUp.bind(this));
    $(window).keydown(C.System.Events.keyDown.bind(this));
    //    this._citronGIS._renderer.view.addEventListener('wheel', C.System.Events.wheel.bind(this));

    this._citronGIS._viewport.on('move', C.System.Events.internalUpdate.bind(this));
};

C.System.Events.zoomInWithAnimation = function () {
    var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(C.Helpers.viewport._resolution);
    if (this._currentAnimation) {
    } else {
        if (zoomLevel + 1 < C.Helpers.ResolutionHelper.Resolutions.length) {
            var resolutionTarget = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];
            C.System.Events.zoomToWithAnimation(resolutionTarget, 0, 0);
        }
    }
};

C.System.Events.zoomOutWithAnimation = function () {
    var zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(C.Helpers.viewport._resolution);
    if (this._currentAnimation) {
    } else {
        if (zoomLevel - 1 >= 0) {
            var resolutionTarget = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1];
            C.System.Events.zoomToWithAnimation(resolutionTarget, 0, 0);
        }
    }
};

C.System.Events.zoomToWithAnimation = function (targetResolution, offsetX, offsetY) {
    var resolution = C.Helpers.viewport._resolution;
    var deltaResolution = targetResolution - C.Helpers.viewport._resolution;
    var step = deltaResolution / 20;
    var animationSpeed = 5;
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
    }

};

C.System.Events.performWheelZoom = function () {
    console.log(this._wheelDelta);
    this._wheelDelta = 0;
}

C.System.Events.wheel = function (evt) {
    this._wheelDelta += evt.deltaY;

    if (this._wheelTimer) {
        clearTimeout(this._wheelTimer);
    }

    this._wheelTimer = setTimeout(this.performWheelZoom.bind(this), 100);

    //    console.log(evt.deltaY, evt);
    //    this._wheel += evt.deltaY;
    //    if (this._wheel <= -this._wheelTrigger) {
    //        this._wheel = 0;
    //        var zoomLevel;
    //        if (!this._zoomAnimation) {
    //            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
    //        } else {
    //            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._resolutionTarget);
    //        }
    //
    //        if (zoomLevel + 1 < C.Helpers.ResolutionHelper.Resolutions.length) {
    //            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel + 1];
    //
    //            if (zoomLevel == this._resolutionTarget) {
    //                return;
    //            }
    //
    //            var dx = evt.offsetX - this._citronGIS._viewport._width / 2;
    //            var dy = evt.offsetY - this._citronGIS._viewport._height / 2;
    //
    //            this._wheeldX = dx;
    //            this._wheeldY = dy;
    //
    //            this._resolutionTarget = zoomLevel;
    //            this._resolutionStep = (this._resolutionTarget - this._citronGIS._viewport._resolution) / this._zoomStep;
    //
    //            clearTimeout(this._zoomAnimation);
    //            setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
    //        }
    //    } else if (this._wheel >= this._wheelTrigger) {
    //        this._wheel = 0;
    //        var zoomLevel;
    //        if (!this._zoomAnimation) {
    //            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._citronGIS._viewport._resolution);
    //        } else {
    //            zoomLevel = C.Helpers.ResolutionHelper.getZoomLevel(this._resolutionTarget);
    //        }
    //
    //        if (zoomLevel - 1 >= 0) {
    //            zoomLevel = C.Helpers.ResolutionHelper.Resolutions[zoomLevel - 1];
    //
    //
    //            if (zoomLevel == this._resolutionTarget) {
    //                return;
    //            }
    //
    //            var dx = evt.offsetX - this._citronGIS._viewport._width / 2;
    //            var dy = evt.offsetY - this._citronGIS._viewport._height / 2;
    //
    //            this._wheeldX = dx;
    //            this._wheeldY = dy;
    //
    //            this._resolutionTarget = zoomLevel;
    //            this._resolutionStep = (this._resolutionTarget - this._citronGIS._viewport._resolution) / this._zoomStep;
    //
    //            clearTimeout(this._zoomAnimation);
    //            setTimeout(C.System.Events.animateZoom.bind(this), this._zoomStepDuration);
    //        }
    //    }
};
//
C.System.Events.keyDown = function (evt) {
    if ((evt.shiftKey && evt.keyCode == 187) ||
        evt.keyCode == 107) /* '+' key */ {
        this.zoomInWithAnimation();
    }
    if ((!evt.shiftKey && evt.keyCode == 54) ||
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
C.System.Events.stageDblClick = function (e) {
    if (e.target == this._citronGIS._renderer.view) {
        var offset = $(this._citronGIS._rootDiv).offset();
        e.X = e.pageX - offset.left;
        e.Y = e.pageY - offset.top;
        var ret = this.emit('mapDblClicked', e);
    }
};

C.System.Events.stageDown = function (e) {
    if (e.target == this._citronGIS._renderer.view) {
        this.emit('mouseDown', e);
        this._isDown = true;
        this._hasMoved = false;
        this._lastX = e.clientX || e.touches[0].pageX;
        this._lastY = e.clientY || e.touches[0].pageY;

        this._lastTime = Date.now();
        this._velocityX = 0;
        this._velocityY = 0;
    }
};

C.System.Events.stageUp = function (e) {
    if (!this._isDown) { return; }

    this.emit('mouseUp', e);
    this._isDown = false;
    if (!this._hasMoved) {
        this.emit('mapClicked', e);
    }

    if (this._velocityX > 0.3 || this._velocityX < -0.3 || this._velocityY > 0.3 || this._velocityY < -0.3) {
        var timeConstant = 400; //ms
        var targetX = (this._velocityX * timeConstant) / 50;
        var targetY = (this._velocityY * timeConstant) / 50;

        this._lastTime = Date.now();
        var self = this;
        function easeOutQuad(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        }
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

C.System.Events.stageMove = function (e) {

    var offset = $(this._citronGIS._rootDiv).offset();
    e.X = e.pageX - offset.left;
    e.Y = e.pageY - offset.top;

    this.emit('mouseMove', e);
    if (!this._isDown) { return; }


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
    this._citronGIS._customRenderer.updatePositions();
    this._citronGIS._viewport._zoomDirection = C.System.Viewport.zoomDirection.NONE;
};
