/*
 *  citrongis.draw.js   Library to easily draw
 */

'use strict';

var drawingLayer = C.Layer();
drawingLayer.addTo(E.Map);

var is_drawing = false;
var DrawingTypes = {
    CIRCLE: 0,
    LINE: 1,
    POLYGON: 2,
    IMAGE: 3
};
var drawingtype = DrawingTypes.CIRCLE;
var state;
var currentfeature;
var lastMousePoint;
var completeCallback;
var currentOptions;

var mousePointer = C.Circle({
    location: C.LatLng(0, 0),
    radius: 8,
    color: 0x4E7BA0,
    outlineColor: 0xffffff,
    outlineWidth: 2
});

var mouseLine = C.Line({
    locations: [C.LatLng(0, 0), C.LatLng(0, 0)],
    width: 8,
    color: 0x4E7BA0
});

var mousePolygon = C.Polygon({
    locations: [C.LatLng(0, 0), C.LatLng(0, 0)],
    color: 0x4E7BA0,
    outlineColor: 0xffffff,
    outlineWidth: 2,
    opacity: 0.5
});

var measuredPoint = [];

function done_editing() {
    is_drawing = false;
    state = undefined;
    drawingtype = false;
    drawingLayer.remove(currentfeature);
    if (completeCallback) {
        completeCallback(currentfeature);
    }
    currentfeature = undefined;
    mouseLine.locations([]);
    mousePolygon.locations([]);
    E.map.remove(mousePointer);
    E.map.remove(mouseLine);
    E.map.remove(mousePolygon);
    for (var i = 0; i < measuredPoint.length; ++i) {
        E.map.remove(measuredPoint[i]);
    }
    measuredPoint = [];
    C.Events.off('mapClicked', mapclicked);
    C.Events.off('mouseMove', mousemove);
}

function mapclicked_circle(evt) {
    switch (state) {
        case 0:
            currentfeature = C.Circle({
                location: evt.getWorldPosition(),
                radius: currentOptions.radius,
                color: currentOptions.color,
                outlineColor: currentOptions.outlineColor,
                outlineWidth: currentOptions.outlineWidth
            });
            drawingLayer.add(currentfeature);
            lastMousePoint = C.Vector2(evt.originalEvent.X, evt.originalEvent.Y);
            state = 1;
            break;
        case 1:
            done_editing();
            break;
    }
}

function mapclicked_line(evt) {
    var pivot = C.Circle({
        location: evt.getWorldPosition(),
        radius: 8,
        color: 0x4E7BA0,
        outlineColor: 0xffffff,
        outlineWidth: 2
    });
    measuredPoint.push(pivot);
    E.map.add(pivot);
    pivot.on('mousedown', function (f, evt) {
        evt.data.originalEvent.preventDefault();
        evt.data.originalEvent.stopPropagation();
    });
    pivot.on('click', function (f) {
        if (f != measuredPoint[measuredPoint.length-1]) {
            var locations = currentfeature.locations();
            locations.push(f.location());
            currentfeature.locations(locations);
        }
        done_editing();
    });
    switch (state) {
        case 0:
            currentfeature = C.Line({
                locations: [evt.getWorldPosition()],
                width: currentOptions.width,
                color: currentOptions.color
            });
            drawingLayer.add(currentfeature);
            E.map.remove(mousePointer);
            state = 1;
            break;
        case 1:
            var locations = currentfeature.locations();
            locations.push(evt.getWorldPosition());
            currentfeature.locations(locations);
            break;
    }
}

function mapclicked_polygon(evt) {
    var pivot = C.Circle({
        location: evt.getWorldPosition(),
        radius: 8,
        color: 0x4E7BA0,
        outlineColor: 0xffffff,
        outlineWidth: 2
    });
    measuredPoint.push(pivot);
    E.map.add(pivot);
    pivot.on('mousedown', function (f, evt) {
        evt.data.originalEvent.preventDefault();
        evt.data.originalEvent.stopPropagation();
    });
    pivot.on('click', function (f) {
        if (f != measuredPoint[measuredPoint.length-1]) {
            var locations = currentfeature.locations();
            locations.push(f.location());
            currentfeature.locations(locations);
        }
        done_editing();
    });
    switch (state) {
        case 0:
            currentfeature = C.Polygon({
                locations: [evt.getWorldPosition()],
                color: currentOptions.color,
                outlineColor: currentOptions.outlineColor,
                outlineWidth: currentOptions.outlineWidth
            });
            drawingLayer.add(currentfeature);
            E.map.remove(mousePointer);
            state = 1;
            break;
        case 1:
            var locations = currentfeature.locations();
            locations.push(evt.getWorldPosition());
            currentfeature.locations(locations);
            break;
    }
}

function mapclicked(evt) {
    if (evt.originalEvent.button == 2 || evt.originalEvent.button == 1) {
        done_editing();
        evt.originalEvent.preventDefault();
        evt.originalEvent.stopPropagation();
        return;
    }
    switch (drawingtype) {
        case DrawingTypes.CIRCLE:
            mapclicked_circle(evt);
            break;
        case DrawingTypes.LINE:
            mapclicked_line(evt);
            break;
        case DrawingTypes.POLYGON:
            mapclicked_polygon(evt);
            break;
        case DrawingTypes.IMAGE:
            break;
    }
}

function mousemove_circle(evt) {
    switch (state) {
        case 1:
            var diff = C.Vector2(evt.originalEvent.X, evt.originalEvent.Y).substract(lastMousePoint);
            var dist = Math.sqrt(Math.pow(diff.X, 2) + Math.pow(diff.Y, 2));

            currentfeature.radius(dist);
            break;
    }
}

function mousemove_line(evt) {
    switch (state) {
        case 1:
            mouseLine.locations([currentfeature.locations()[currentfeature.locations().length-1], evt.getWorldPosition()]);
            break;
    }
}

function mousemove_polygon(evt) {
    switch (state) {
        case 1:
            var pts = currentfeature.locations();
            if (pts.length >= 2) {
                mousePolygon.locations([pts[0], pts[pts.length-1], evt.getWorldPosition()]);
            } else if (pts.length == 1) {
                mousePolygon.locations([pts[0], evt.getWorldPosition()]);
            }
            break;
    }
}

function mousemove(evt) {
    if (!is_drawing) { return; }

    mousePointer.location(evt.getWorldPosition());

    switch(drawingtype) {
        case DrawingTypes.CIRCLE:
            mousemove_circle(evt);
            break;
        case DrawingTypes.LINE:
            mousemove_line(evt);
            break;
        case DrawingTypes.POLYGON:
            mousemove_polygon(evt);
            break;
    }
}

/*
 *  Draws a circle
 */
function drawCircle(options, callback) {

    if (is_drawing) { return undefined; }
    currentOptions = options || {};
    is_drawing = true;
    drawingtype = DrawingTypes.CIRCLE;
    state = 0;
    completeCallback = callback;

    C.Events.on('mouseMove', mousemove);
    C.Events.on('mapClicked', mapclicked);

    E.map.add(mousePointer);
}

/*
 *  Draws a line
 */
function drawLine(options, callback) {

    if (is_drawing) { return undefined; }
    currentOptions = options || {};
    is_drawing = true;
    drawingtype = DrawingTypes.LINE;
    state = 0;
    completeCallback = callback;
    measuredPoint = [];

    C.Events.on('mouseMove', mousemove);
    C.Events.on('mapClicked', mapclicked);

    E.map.add(mousePointer);
    E.map.add(mouseLine);
}

/*
 *  Draws a polygon
 */
function drawPolygon(options, callback) {

    if (is_drawing) { return undefined; }
    currentOptions = options || {};
    is_drawing = true;
    drawingtype = DrawingTypes.POLYGON;
    state = 0;
    completeCallback = callback;
    measuredPoint = [];

    C.Events.on('mouseMove', mousemove);
    C.Events.on('mapClicked', mapclicked);

    E.map.add(mousePointer);
    E.map.add(mousePolygon);
}

function updateOptions(options) {
    if (!is_drawing) { return; }
    C.Utils.Object.merge(currentOptions, options);
    if (!currentfeature) { return; }
    switch (drawingtype) {
        case DrawingTypes.CIRCLE:
            if (options.color) { currentfeature.color(options.color); }
            if (options.outlineColor) { currentfeature.outlineColor(options.outlineColor); }
            if (options.outlineWidth) { currentfeature.outlineWidth(options.outlineWidth); }
            break;
        case DrawingTypes.LINE:
            if (options.color) { currentfeature.color(options.color); }
            if (options.width) { currentfeature.width(options.width); }
            break;
        case DrawingTypes.POLYGON:
            if (options.color) { currentfeature.color(options.color); }
            if (options.outlineColor) { currentfeature.outlineColor(options.outlineColor); }
            if (options.outlineWidth) { currentfeature.outlineWidth(options.outlineWidth); }
            break;
    }
}

function abort() {
    is_drawing = false;
    state = undefined;
    drawingtype = false;
    drawingLayer.remove(currentfeature);
    currentfeature = undefined;
    E.map.remove(mousePointer);
    E.map.remove(mouseLine);
    E.map.remove(mousePolygon);
    for (var i = 0; i < measuredPoint.length; ++i) {
        E.map.remove(measuredPoint[i]);
    }
    measuredPoint = [];
}

E.ondestroy(function () {
    C.Events.off('mapClicked', mapclicked);
    C.Events.off('mouseMove', mousemove);
    E.map.remove(mousePointer);
});

module.exports = {
    drawCircle: drawCircle,
    drawLine: drawLine,
    drawPolygon: drawPolygon,
    updateOptions: updateOptions,
    abort: abort
};
