E.onload(function () {

    var input = E.$('#search-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    var layer = C.Layer();
    layer.addTo(E.map);
    var popup;

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        layer.clearLayer();
        if (popup) {
            popup.close();
        }

        // For each place, get the icon, name and location.
        var bounds = C.Bounds();
        places.forEach(function(place) {

            var marker;
            var location = C.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            if (place.geometry.viewport) {
                var southWest = place.geometry.viewport.getSouthWest();
                var northEast = place.geometry.viewport.getNorthEast();
                bounds.extend(C.LatLng(southWest.lat(), southWest.lng()));
                bounds.extend(C.LatLng(northEast.lat(), northEast.lng()));
            } else {
                bounds.extend(location);
            }

            marker = C.Image({
                location: location,
                source: 'assets/marker-icon.png',
                width: 25,
                height: 41,
                anchorX: 0.45,
                anchorY: 1,
                scaleMode: C.ImageScaleMode.NEAREST
            });
            marker.load();
            layer.add(marker);
            popup = C.Popup(marker, {
                content: '<span class="place-name">' + place.name + '<span>'
            });
            marker.bindPopup(popup);
        });
        C.Events.zoomToBounds(bounds);
    });

});
E.Display('ui/index.tmpl');
