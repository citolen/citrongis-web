var apiUrl = 'https://api.what3words.com/position?key='+ module.strings.api_key + '&position=$lat,$long';

var group = module.layerHelper.createGroup({
    name: 'what3words'
});

var baseLayer = new C.Geo.Layer({});

group.addLayer(baseLayer);

var marker = new C.Geo.Feature.Image({
    location: C.Helpers.viewport._origin,
    width: 90,
    height: 90,
    anchorX: 0.5,
    anchorY: 1,
    source: '/src/modules/what3words/assets/marker.png',
    scaleMode: C.Geo.Feature.Image.ScaleMode.NEAREST
});

marker.load();

//var marker = new C.Geo.Feature.Circle({
//    radius: 10,
//    location: C.Helpers.viewport._origin,
//    outlineColor: 0xBF4E6C,
//    backgroundColor: 0xffffff,
//    outlineWidth: 3
//});

baseLayer.addFeature(marker);

C.Helpers.viewport.on('move', function (viewport) {

    marker.location(viewport._origin);

});

C.Helpers.viewport.on('moved', function (viewport) {

    var pos = viewport._origin.copy().TransformTo(C.Helpers.ProjectionsHelper.WGS84);

    get3words(pos);

});

function get3words(position) {
    var url = apiUrl;
    url = url.replace('$lat', position.Y);
    url = url.replace('$lon', position.X);

    $('div.what3words-content').html('<i class="fa fa-spinner fa-spin"></i>');
    $('div.what3words-position').html((Math.floor(position.Y * 1000000) / 1000000) + ' ' + (Math.floor(position.X * 1000000) / 1000000));

    $.get(url, function (data, status) {
        var text = '';
        for (var i = 0; i < data.words.length; ++i) {
            text += data.words[i] + ((i != data.words.length-1) ? ('.') : (''));
        }

        $('div.what3words-content').html(text);
    });
}

this.onLoaded = function () {


};
