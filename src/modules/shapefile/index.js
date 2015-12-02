var self = this;
var layer = C.PerformanceLayer();
layer.addTo(E.map);

//var visible = true;
//C.Viewport.on('move', function () {
//    if (visible) {
//        visible = false;
//        E.map.remove(layer);
//        //        var features = layer._features;
//        //        for (var i = 0; i < features.length; ++i) {
//        //            features[i].__graphics.cacheAsBitmap = false;
//        //        }
//        //        layer.__graphics.cacheAsBitmap = false;
//    }
//});
//
//C.Viewport.on('moved', function () {
//    visible = true;
//    layer.addTo(E.map);
//    var features = layer._features;
//    //    for (var i = 0; i < features.length; ++i) {
//    //        features[i].__graphics.cacheAsBitmap = true;
//    //        features[i].__graphics.cacheAsBitmap = false;
//    //        features[i].__graphics.cacheAsBitmap = true;
//    //    }
//    //    layer.__graphics.cacheAsBitmap = true;
//});

E.ondestroy(function () {

});

require('lib/shp.js', function (err) {
    if (err) {
        console.error(err);
    }

    function parsePolygon(geometry) {
        var coordinates = geometry[0];
        var points = [];
        for (var i = 0; i < coordinates.length; ++i) {
            points.push(C.LatLng(coordinates[i][1], coordinates[i][0]));
        }
        return C.Polygon({
            locations: points,
            color: 0xffffff,
            outlineColor: 0x00,
            outlineWidth: 1,
            opacity: 0.5
        });
    }

    function parseMultiPolygon(geometry) {
        var coordinates = geometry.coordinates;
        var features = [];
        for (var i = 0; i < coordinates.length; ++i) {
            var polygon = coordinates[i];
            features.push(parsePolygon(polygon));
        }
        return features;
    }

    function parseGeometry(geometry) {
        switch (geometry.type) {
            case "MultiPolygon":
                return parseMultiPolygon(geometry);
                break;
            case "Polygon":
                return [parsePolygon(geometry.coordinates)];
                break;
            default:
                //                console.log(geometry.type);
        }
    }

    function generateContent(properties) {
        var output = '<div class="properties">';
        for (var key in properties) {
            var val = properties[key];
            output += key + ': ' + val + '<br />';
        }
        output += '</div>';
        return output;
    }

    function parseFeatures(features) {
        for (var i = 0; i < features.length; ++i) {
            var feature = features[i];

            var entry = {
                featureInfo: feature,
                geometry: parseGeometry(feature.geometry)
            };

            for (var j = 0; j < entry.geometry.length; ++j) {
                var feature = entry.geometry[j];
                layer.add(feature);
                feature.set('info', entry.featureInfo);
                feature.on('click', function (feature, event) {
                    var info = feature.get('info');
                    var popup = feature.get('popup');
                    if (!popup) {
                        var popup = C.Popup(feature, {
                            content: generateContent(info.properties)
                        });
                        popup.on('close', function (feature) {
                            feature.outlineWidth(1);
                            feature.outlineColor(0);
                        }.bind(null, feature));
                        feature.set('popup', popup);
                    }
                    if (!popup._opened) {
                        feature.outlineWidth(4);
                        feature.outlineColor(0xff0000);
                    }
                    popup.toggle(event);
                });
            }

        }
    }

    function processShapefile(reader) {

        //        console.log('start parsing')
        shp(reader.result).then(function (result) {
            //            console.log('done parsing');
            if (!result.length) {
                parseFeatures(result.features);
            } else {
                for (var i = 0; i < result.length; ++i) {
                    parseFeatures(result[i].features);
                }
            }
            setTimeout(function () {
                C.Events.zoomToBounds(layer.getBounds());
            }, 500);
        });
    }

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $(this).removeClass('drag_end');
        evt = evt.originalEvent;
        var files = evt.dataTransfer.files;
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = processShapefile.bind(null, reader);
            reader.readAsArrayBuffer(f);
        }
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        $(this).addClass('drag_end');
    }

    E.onload(function () {
        var dropZone = E.$('#drop_zone');
        dropZone.on('dragover', handleDragOver);
        dropZone.on('dragleave', function () { $(this).removeClass('drag_end'); });
        dropZone.on('drop', handleFileSelect);

        E.$('#input_file')[0].onchange = function () {
            var reader = new FileReader();
            reader.onload = processShapefile.bind(null, reader);
            reader.readAsArrayBuffer(this.files[0]);
        };
    });

    E.Display('ui/index.tmpl');
});
