var my_data_layer = C.Layer();
my_data_layer.addTo(E.map);

console.log("test");

E.onload(function () {
    var satelittePts = C.Image({
        location: C.LatLng(0, 0),
        source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/FP_Satellite_icon.svg/1024px-FP_Satellite_icon.svg.png",
        width: 50,
        height: 50,
        anchorX: 0.5,
        anchorY: 0.5
    });
    satelittePts.load();

    var popup = C.Popup(satelittePts, {
        content: '<h1> Name</h1><h5>( 48 / 2 ) </h5><table class="table table-bordered text-center"><thead><tr><th></th><th><img src="/src/modules/satellite/assets/speed.png"/></th><th><img src="/src/modules/satellite/assets/altitude.png"/></th></tr></thead><tbody><tr><th><img src="/src/modules/satellite/assets/stats.png"/></th><td>120 km/h</td><td>420 km</td></tr><tr><th><img src="/src/modules/satellite/assets/sun.png"/></th><td colspan="2">Visibility</td></tr></tbody></table>'
    });
    satelittePts.bindPopup(popup);

    var position_cache = {};
    var dataHolder = {};

    var firstFix = true;
    var isReady = false;
    var refresh_api = function() {
        $.get("https://api.wheretheiss.at/v1/satellites/25544", function (Sat) {
            position_cache.old_pos = position_cache.current_pos;
            position_cache.current_pos = C.LatLng(Sat.latitude, Sat.longitude);

            dataHolder.name = Sat.name;
            dataHolder.speed = Sat.velocity.toPrecision(6);
            dataHolder.altitude = Sat.altitude.toPrecision(6);
            dataHolder.visibility = Sat.visibility;
            dataHolder.units = Sat.units;

            if (firstFix) {
                firstFix = false;
                satelittePts.addTo(my_data_layer);
                satelittePts.location(position_cache.current_pos);
            } else {
                isReady = true;
                satelittePts.location(position_cache.old_pos);
            }
        });
    }

    var refresh = function() {
        if (isReady) {
            var delta_pos = C.LatLng(position_cache.current_pos.Y - position_cache.old_pos.Y, position_cache.current_pos.X - position_cache.old_pos.X)
            var newPos = C.LatLng(satelittePts.location().Y + (delta_pos.Y / 250), satelittePts.location().X + (delta_pos.X / 250));

            satelittePts.location(newPos);

            //            $($(popup.dom).children()[0]).html('<h1>' + dataHolder.name + '</h1><h5>( ' + dataHolder.position.Y + ' / ' + dataHolder.position.X + ' ) </h5><table class="table table-bordered text-center"><thead><tr><th></th><th><img src="/src/modules/satellite/assets/speed.png"/></th><th><img src="/src/modules/satellite/assets/altitude.png"/></th></tr></thead><tbody><tr><th><img src="/src/modules/satellite/assets/stats.png"/></th><td>' + dataHolder.speed + ' km/h</td><td>' + dataHolder.altitude + ' km</td></tr><tr><th><img src="/src/modules/satellite/assets/sun.png"/></th><td colspan="2">' + dataHolder.visibility + '</td></tr></tbody></table>')
        } else {
            satelittePts.location(position_cache.current_pos);
        }
    }


    var interval_api = setInterval(refresh_api, 5000);
    var interval_refresh = setInterval(refresh, 20);
    refresh_api();

    E.ondestroy(function() {
        clearInterval(interval_api);
        clearInterval(interval_refresh);
    })
});

E.Display('ui/index.tmpl');
