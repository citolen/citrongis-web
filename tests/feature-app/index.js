var layerGroup = module.layerHelper.createGroup({
    name: 'Default'
});

var layer = module.layerHelper.createLayer({
    name: 'Vector layer'
});

layerGroup.addLayer(layer);

this.southAmerica = new C.Geo.Feature.Polygon({
    locations: [
        new C.Geometry.LatLng(-55.679726, -68.288577),
        new C.Geometry.LatLng(-18.316418, -70.573733),
        new C.Geometry.LatLng(-5.094729, -81.823733),
        new C.Geometry.LatLng(12.722377, -73.913577),
        new C.Geometry.LatLng(-6.493759, -34.187013)
    ],
    fillColor: 0x6e6eff,
    outlineWidth: 5
});

layer.addFeature(this.southAmerica);

module.ui.display('ui/index.tmpl');
