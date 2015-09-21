var apiUrl = 'https://api.what3words.com/position?key='+ E.Strings.api_key + '&position=$lat,$long&lang=$lang';
var apiUrlLang = 'https://api.what3words.com/get-languages?key=' + E.Strings.api_key;
var apiUrlWords = 'https://api.what3words.com/w3w?key=' + E.Strings.api_key + '&lang=$lang&string=$words';

var directionAPI = 'https://maps.googleapis.com/maps/api/directions/json?key=' + E.Strings.google_key + '&origin=$origin&destination=$destination';

var lang = 'en';
var currentWords = [];

var group = C.LayerGroup({
    name: 'what3words'
});

var baseLayer = C.Layer();
var pointerLayer = C.Layer();
var lines = [];
var points = [];

baseLayer.addTo(group);
pointerLayer.addTo(group);

var marker = C.Image({
    location: C.Viewport._origin,
    width: 90,
    height: 112,
    anchorX: 0.5,
    anchorY: 1,
    source: 'assets/marker.png',
    scaleMode: C.ImageScaleMode.DEFAULT
});

marker.load();

marker.addTo(pointerLayer);

C.Viewport.on('move', function (viewport) {

    marker.location(viewport._origin);

});

function refresh(viewport) {
    var pos = viewport._origin.copy().TransformTo(C.ProjectionsHelper.WGS84);

    get3words(pos);
}

C.Viewport.on('moved', function (viewport) {

    refresh(viewport);

});

function get3words(position) {
    var url = apiUrl;
    url = url.replace('$lat', position.Y);
    url = url.replace('$lon', position.X);
    url = url.replace('$lang', lang);

    E.$('div.content').html('<i class="fa fa-spinner fa-spin"></i>');
    E.$('div.position').html((Math.floor(position.Y * 1000000) / 1000000) + ' ' + (Math.floor(position.X * 1000000) / 1000000));

    $.get(url, function (data, status) {
        var text = '';
        for (var i = 0; i < data.words.length; ++i) {
            text += data.words[i] + ((i != data.words.length-1) ? ('.') : (''));
        }
        currentWords = data.words;

        E.$('div.content').html(text);
    });
}

function loadLanguages() {
    $.get(apiUrlLang, function (data) {
        var languages = data.languages;
        for (var i = 0; i < languages.length; ++i) {
            var language = languages[i];
            var option = document.createElement('option');
            $(option).attr('value', language.code);
            $(option).text(language.name_display);
            if (language.code == lang) {
                $(option).attr('selected', '');
            }
            E.$('#lang-select').append(option);
        }

        E.$('#lang-select').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;

            lang = valueSelected;

            refresh(C.Viewport);
        });
    });
}

$.fn.textWidth = function(){
    var html_org = $(this).html();
    var html_calc = '<span>' + html_org + '</span>';
    $(this).html(html_calc);
    var width = $(this).find('span:first').width();
    $(this).html(html_org);
    return width;
};

function getPositionForWords(words, callback) {
    var url = apiUrlWords;
    url = url.replace('$words', words);
    url = url.replace('$lang', lang);

    $.get(url, function (data, status) {

        if (data.error) { return callback(true); }

        callback(null, data.position);
    });
}

function clearDirection() {

    for (var i = 0; i < lines.length; ++i) {
        baseLayer.removeFeature(lines[i]);
    }
    lines = [];
    for (var i = 0; i < points.length; ++i) {
        baseLayer.removeFeature(points[i]);
    }
    points = [];

}

function getItinerary(origin, destination, callback) {

    clearDirection();

    var request = {
        destination: new google.maps.LatLng(destination[0], destination[1]),
        origin: new google.maps.LatLng(origin[0], origin[1]),
        travelMode: google.maps.TravelMode.DRIVING
    };

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var steps = response.routes[0].legs[0].steps;
            var pts = [];
            for (var i = 0; i < steps.length; ++i) {
                var lat_lng = steps[i].lat_lngs;
                for (var j = 0; j < lat_lng.length; ++j) {
                    pts.push(C.LatLng(lat_lng[j].lat(), lat_lng[j].lng()));
                }
            }
            var npts = simplify(pts, 0.0001);
            var line = C.Line({
                locations: npts,
                lineColor: 0xF2676B,
                lineWidth: 8
            });
            line.addTo(baseLayer);
            lines.push(line);
            var marker_start = C.Image({
                location: npts[0],
                width: 25,
                height: 36,
                anchorX: 0.5,
                anchorY: 1,
                source: '../../src/modules/what3words/assets/marker_start.png',
                scaleMode: C.ImageScaleMode.DEFAULT
            });
            marker_start.load();
            points.push(marker_start);
            marker_start.addTo(baseLayer);
            var marker_end = C.Image({
                location: npts[npts.length-1],
                width: 25,
                height: 36,
                anchorX: 0.5,
                anchorY: 1,
                source: '../../src/modules/what3words/assets/marker_end.png',
                scaleMode: C.ImageScaleMode.DEFAULT
            });
            marker_end.load();
            points.push(marker_end);
            marker_end.addTo(baseLayer);
        }
    });
}

this.onLoaded = function () {

    loadLanguages();

    resizeField('#i1-f1');
//    resizeField('#i1-f2');
//    resizeField('#i1-f3');
    resizeField('#i2-f1');
//    resizeField('#i2-f2');
//    resizeField('#i2-f3');

    //period.tend.javelin
    //hosts.lush.soldiers

    E.$('#load1').click(function () {
        if (currentWords.length != 3) { return; }

        E.$('#i1-f1').val(currentWords.join('.')); resizeField('#i1-f1');
//        $('#i1-f2').val(currentWords[1]); resizeField('#i1-f2');
//        $('#i1-f3').val(currentWords[2]); resizeField('#i1-f3');

    });

    E.$('#load2').click(function () {
        if (currentWords.length != 3) { return; }

        E.$('#i2-f1').val(currentWords.join('.')); resizeField('#i2-f1');
//        $('#i2-f2').val(currentWords[1]); resizeField('#i2-f2');
//        $('#i2-f3').val(currentWords[2]); resizeField('#i2-f3');
    });

    E.$('#itinary').click(function () {
        var w1 = E.$('#i1-f1').val();
//        var w2 = $('#i1-f2').val();
//        var w3 = $('#i1-f3').val();
        var w4 = E.$('#i2-f1').val();
//        var w5 = $('#i2-f2').val();
//        var w6 = $('#i2-f3').val();

        if (w1.length < 12 ||
            w4.length < 12) { return; }

        getPositionForWords(w1, function (err, position1) {
            if (err) { return; }
            getPositionForWords(w4, function (err, position2) {
                if (err) { return; }

                console.log('-itinerary', position1, position2);

                getItinerary(position1, position2, function () {

                });
            });
        });
    });

    E.$('#search').click(function () {
        var w1 = E.$('#i1-f1').val();
//        var w2 = $('#i1-f2').val();
//        var w3 = $('#i1-f3').val();

        if (w1.length < 12) { return; }
        getPositionForWords(w1, function (err, position) {
            if (err) { return; }
            var newCenter = C.LatLng(position[0], position[1]);
            newCenter.TransformTo(C.ProjectionsHelper.EPSG3857);
            C.Viewport.setCenter(newCenter);
        });
    });

    function resizeField(event) {
        var text = E.$(event.currentTarget || event).val();
        E.$('.width-calculator').html(text);
        var width = E.$('.width-calculator').textWidth();
        E.$(event.currentTarget || event).width(width);
    }

    E.$('.input-field').keyup(resizeField);

    refresh(C.Viewport);
};
