var my_data_layer = C.Layer();
my_data_layer.addTo(E.map);

E.onload(function () {

    var satelittePts = C.Image({
        location: C.LatLng(0, 0),
        source: "assets/satellite.png",
        width: 50,
        height: 50,
        anchorX: 0.5,
        anchorY: 0.5
    });
    satelittePts.load();

    var popup;

    var position_cache = {};
    var dataHolder = {};

    var firstFix = true;
    var isReady = false;
    var fix = false;

    $('.fix_btn').on('click', function (e) {
        if (!$(this).find('i').hasClass('fa-check-square-o')) {
            $(this).find('i').addClass('fa-check-square-o');
            $(this).find('i').removeClass('fa-square-o');
            fix = true;
            if (!firstFix) {
                var center = C.CoordinatesHelper.TransformTo(position_cache.current_pos, C.ProjectionsHelper.EPSG3857);
//                C.Viewport.setCenter(center);
                C.Events.zoomToCenterWithAnimation(C.Viewport._resolution, center);
            }
        } else {
            $(this).find('i').removeClass('fa-check-square-o');
            $(this).find('i').addClass('fa-square-o');
            fix = false;
        }
    });

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
                popup = C.Popup(satelittePts, {
                    content: '<div class="content"><h1>ISS</h1><h5 id="sat_position">( ' + position_cache.current_pos.Y.toPrecision(6) + ' / ' + position_cache.current_pos.X.toPrecision(6) + ' )</h5><table class="table table-bordered text-center"><thead><tr><th></th><th><img src="{@image src="assets/speed.png" /}" /></th><th><img src="{@image src="assets/altitude.png" /}" /></th></tr></thead><tbody><tr><th><img src="{@image src="assets/stats.png" /}" /></th><td id="sat_speed"> ' + dataHolder.speed + ' </td><td id="sat_altitude">' + dataHolder.altitude + '</td></tr><tr><th><img src="{@image src="assets/sun.png" /}" /></th><td colspan="2" id="sat_visibility">' + dataHolder.visibility + '</td></tr></tbody></table></div>'
                });
                satelittePts.bindPopup(popup);
            } else {
                isReady = true;
                satelittePts.location(position_cache.old_pos);
            }
        });
    }

    var refresh = function() {
        if (isReady) {
            var delta_pos = C.LatLng(position_cache.current_pos.Y - position_cache.old_pos.Y, position_cache.current_pos.X - position_cache.old_pos.X)
            var newPos = C.LatLng(satelittePts.location().Y + (delta_pos.Y / 100), satelittePts.location().X + (delta_pos.X / 100));

            satelittePts.location(newPos);

            popup.$('#sat_position').text('( ' + newPos.Y.toPrecision(6) + ' / ' + newPos.X.toPrecision(6) + ')');
            popup.$('#sat_speed').text(dataHolder.speed + ' km/h');
            popup.$('#sat_altitude').text(dataHolder.altitude + ' km');
            popup.$('#sat_visibility').text(dataHolder.visibility);

            var center = C.CoordinatesHelper.TransformTo(newPos, C.ProjectionsHelper.EPSG3857);

            if (fix) {
                C.Viewport.setCenter(center);
            }

            //            $($(popup.dom).children()[0]).html('<h1>' + dataHolder.name + '</h1><h5>( ' + dataHolder.position.Y + ' / ' + dataHolder.position.X + ' ) </h5><table class="table table-bordered text-center"><thead><tr><th></th><th><img src="/src/modules/satellite/assets/speed.png"/></th><th><img src="/src/modules/satellite/assets/altitude.png"/></th></tr></thead><tbody><tr><th><img src="/src/modules/satellite/assets/stats.png"/></th><td>' + dataHolder.speed + ' km/h</td><td>' + dataHolder.altitude + ' km</td></tr><tr><th><img src="/src/modules/satellite/assets/sun.png"/></th><td colspan="2">' + dataHolder.visibility + '</td></tr></tbody></table>')
        } else {
            satelittePts.location(position_cache.current_pos);
        }
    }


    var interval_api = setInterval(refresh_api, 5000);
    var interval_refresh = setInterval(refresh, 50);
    refresh_api();

    E.ondestroy(function() {
        clearInterval(interval_api);
        clearInterval(interval_refresh);
    })
});

E.Display('ui/index.tmpl');
