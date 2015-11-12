/*
 *  QueryFormatter.js   Format queries to send them to server
 */

'use strict';

function formatCircle(feature) {
    return {
        location: [feature._location.X, feature._location.Y],
        crs: C.ProjectionsHelper.getProjectionName(feature._location.CRS),
        color: feature._color,
        radius: feature._radius,
        outlineWidth: feature._outlineWidth,
        outlineColor: feature._outlineColor,
        type: feature._type
    };
}

function formatLine(feature) {
    var locations = feature._locations;
    var crs;
    if (locations.length > 0) {
        crs = C.ProjectionsHelper.getProjectionName(feature._locations[0].CRS);
    }
    var locationsOutput = [];
    for (var i = 0; i < locations.length; ++i) {
        locationsOutput.push([locations[i].X, locations[i].Y]);
    }
    return {
        location: locationsOutput,
        crs: crs,
        color: feature._color,
        width: feature._width,
        type: feature._type
    };
}

function formatPolygon(feature) {
    var locations = feature._locations;
    var crs;
    if (locations.length > 0) {
        crs = C.ProjectionsHelper.getProjectionName(feature._locations[0].CRS);
    }
    var locationsOutput = [];
    for (var i = 0; i < locations.length; ++i) {
        locationsOutput.push([locations[i].X, locations[i].Y]);
    }
    return {
        location: locationsOutput,
        crs: crs,
        color: feature._color,
        outlineWidth: feature._outlineWidth,
        outlineColor: feature._outlineColor,
        type: feature._type
    };
}

function formatFeature(feature) {
    switch (feature._type) {
        case C.FeatureType.CIRCLE:
            return formatCircle(feature);
            break;
        case C.FeatureType.LINE:
            return formatLine(feature);
            break;
        case C.FeatureType.POLYGON:
            return formatPolygon(feature);
            break;
    }
}

function circleFromData(data) {

    var crs = C.ProjectionsHelper.getProjectionFromName(data.crs);
    var location = C.Point(data.location[0], data.location[1], 0, crs);

    return C.Circle({
        location: location,
        color: data.color,
        radius: data.radius,
        outlineWidth: data.outlineWidth,
        outlineColor: data.outlineColor
    });
}

function lineFromData(data) {

    var crs = C.ProjectionsHelper.getProjectionFromName(data.crs);
    var location = data.location;
    var locations = [];
    for (var i = 0; i < location.length; ++i) {
        var loc = location[i];
        locations.push(C.Point(loc[0], loc[1], 0, crs));
    }

    return C.Line({
        locations: locations,
        color: data.color,
        width: data.width
    });
}

function polygonFromData(data) {

    var crs = C.ProjectionsHelper.getProjectionFromName(data.crs);
    var location = data.location;
    var locations = [];
    for (var i = 0; i < location.length; ++i) {
        var loc = location[i];
        locations.push(C.Point(loc[0], loc[1], 0, crs));
    }

    return C.Polygon({
        locations: locations,
        color: data.color,
        outlineWidth: data.outlineWidth,
        outlineColor: data.outlineColor
    });
}

function featureFromData(data) {
    switch (data.type) {
        case C.FeatureType.CIRCLE:
            return circleFromData(data);
            break;
        case C.FeatureType.LINE:
            return lineFromData(data);
            break;
        case C.FeatureType.POLYGON:
            return polygonFromData(data);
            break;
    }
}

function updateCircleWithData(feature, data) {
    if (data.location && data.crs) {
        var crs = C.ProjectionsHelper.getProjectionFromName(data.crs);
        var location = C.Point(data.location[0], data.location[1], 0, crs);
        feature.location(location);
    }
    if (data.color) { feature.color(data.color); }
    if (data.radius) { feature.radius(data.radius); }
    if (data.outlineColor) { feature.outlineColor(data.outlineColor); }
    if (data.outlineWidth) { feature.outlineWidth(data.outlineWidth); }
}

function updateLineWithData(feature, data) {
    if (data.location && data.crs) {
        var crs = C.ProjectionsHelper.getProjectionFromName(data.crs);
        var location = data.location;
        var locations = [];
        for (var i = 0; i < location.length; ++i) {
            var loc = location[i];
            locations.push(C.Point(loc[0], loc[1], 0, crs));
        }
        feature.locations(locations);
    }
    if (data.color) { feature.color(data.color); }
    if (data.width) { feature.width(data.width); }
}

function updatePolygonWithData(feature, data) {
    if (data.location && data.crs) {
        var crs = C.ProjectionsHelper.getProjectionFromName(data.crs);
        var location = data.location;
        var locations = [];
        for (var i = 0; i < location.length; ++i) {
            var loc = location[i];
            locations.push(C.Point(loc[0], loc[1], 0, crs));
        }
        feature.locations(locations);
    }
    if (data.color) { feature.color(data.color); }
    if (data.outlineColor) { feature.outlineColor(data.outlineColor); }
    if (data.outlineWidth) { feature.outlineWidth(data.outlineWidth); }
}

function updateWithData(feature, data) {
    switch (feature._type) {
        case C.FeatureType.CIRCLE:
            updateCircleWithData(feature, data);
            break;
        case C.FeatureType.LINE:
            updateLineWithData(feature, data);
            break;
        case C.FeatureType.POLYGON:
            updatePolygonWithData(feature, data);
            break;
    }
}

module.exports = {

    formatFeature: formatFeature,
    featureFromData: featureFromData,
    updateWithData: updateWithData

};
