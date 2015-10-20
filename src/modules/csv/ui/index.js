var self = this;
require('lib/papaparse.min.js', function (err, Papa) {
    require('lib/citrongis.cluster.js', function (err, Cluster) {
        self._csvLayer = new Cluster();

        console.log(self._csvLayer);
        self._csvLayer.addTo(E.map);

        function processCSV(csv) {
            var data = Papa.parse(csv.target.result, {
                newline: '\n'
            });
            var headers = data.data[0];
            for (var i = 0; i < headers.length; ++i) {
                if (headers[i].length > 0) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.innerHTML = headers[i];
                    E.$('#select_latitude').append($(option));
                    E.$('#select_longitude').append($(option).clone());
                }
            }
            self._data = data.data;
            E.$('#drop_zone').hide();
            E.$('#csv_zone').fadeIn();
        }

        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $(this).removeClass('drag_end');
            evt = evt.originalEvent;
            var files = evt.dataTransfer.files;
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = processCSV;
                reader.readAsText(f, 'utf-8');
            }
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            $(this).addClass('drag_end');
        }

        function generatePopupContent(header, entry) {
            var content = '<div class="csv-container"><table class="csv-popup">';
            for (var i = 0; i < header.length; ++i) {

                if (header[i].length > 0 || entry[i].length > 0) {
                    content += '<tr class="csv-entry">';
                    content += '<td class="csv-header">' + header[i] + '</td>';
                    content += '<td class="csv-value">' + entry[i] + '</td>';
                    content += '</tr>';
                }
            }
            content += '</table></div>';
            return content;
        }

        function displayData() {
            if (!self._data) { return; }

            var header = self._data[0];
            var lat_idx = parseInt(E.$('#select_latitude').val());
            var lng_idx = parseInt(E.$('#select_longitude').val());

            for (var i = 1; i < self._data.length; ++i) {
                var entry = self._data[i];
                var lat = parseFloat(entry[lat_idx]);
                var lng = parseFloat(entry[lng_idx]);

                if (isNaN(lat) || isNaN(lng)) { continue; }

                var marker = C.Circle({
                    location: C.LatLng(lat, lng),
                    radius: 6,
                    backgroundColor: 0xffffff,
                    outlineColor: 0xeb444e,
                    outlineWidth: 3
                });

                marker.set('entry', entry);
                marker.on('click', function (marker, event) {
                    var popup = marker.get('popup');
                    var entry = marker.get('entry');

                    if (!popup) {
                        popup = C.Popup(marker, {
                            content: generatePopupContent(header, entry)
                        });

                        marker.set('popup', popup);

                        marker.bindPopup(popup);

                        popup.open(event);
                    }
                });

                marker.addTo(self._csvLayer);
            }
        }

        E.onload(function () {
            var dropZone = E.$('#drop_zone');
            dropZone.on('dragover', handleDragOver);
            dropZone.on('dragleave', function () { $(this).removeClass('drag_end'); });
            dropZone.on('drop', handleFileSelect);

            E.$('#display_btn').click(displayData);
        });
    });
});
