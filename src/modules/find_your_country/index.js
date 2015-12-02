require(['ui/output.json',
         'lib/polyk.js'], function (err, req) {
    if (err) {
        return console.error(err);
    }

    var data = req[0];
    var PolyK = req[1];

    data = JSON.parse(data);

    var layer = C.Layer();
    C.TileLayer({
        source: C.TMSSource({
            url: 'https://a.tiles.mapbox.com/v4/mapbox.3czhncdi/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoidHJpc3RlbiIsImEiOiJuZ2E5MG5BIn0.39lpfFC5Nxyqck1qbTNquQ'
        }),
        schema: C.TileSchema.SphericalMercatorRetina
    }).addTo(E.map);
    layer.addTo(E.map);

    for (var i = 0; i < data.length; ++i) {
        var country = data[i];
        country.polygons = [];
        var geometry = country.geometry;
        var intersectionGeo = [];
        for (var j = 0; j < geometry.length; ++j) {
            var geo = geometry[j];
            var locations = [];
            var intersectionLocations = [];
            for (var k = 0; k < geo.length; ++k) {
                locations.push(C.LatLng(geo[k][1], geo[k][0]));
                intersectionLocations.push(geo[k][0], geo[k][1]);
            }
            intersectionGeo.push(intersectionLocations);
            var poly = C.Polygon({
                locations: locations,
                color: 0xff0000,
                outlineColor: 0x0,
                outlineWidth: 0.1,
				opacity: 0.5
            });
            //            poly.addTo(layer);
            country.polygons.push(poly);
        }
        country.intersectionGeometry = intersectionGeo;
//        console.log(country);
    }

    var score = 0;

    var countryToFind;
    var rdm = 0;

    var timestamp;
    var counter = 10;
    var playing = false;

    E.onload(function () {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

		function updateTop() {

			E.$("#scores_table").show();
			$.get('http://localhost:3000/ranking', {"limit":10}, function (result_data) {
				var topScores = "";
				var cpt = 1;
				for (var key in result_data) {
					if (result_data.hasOwnProperty(key)) {
						result_data[key]["user_name"];
						topScores = topScores + "<tr><th>" + cpt + "</th>" + "<td>" + result_data[key]["user_name"] + "</td>" + "<td>" + result_data[key]["user_score"] + "</td>" + "</tr>";
						cpt = cpt + 1;
					}
				}
				E.$("#scores_table tbody").html(topScores);
			});
		}

		function showScores() {

			E.$("#score_name").show();
			var rank_data = {"user_name":"brice", "user_score": score};
			$.post('http://localhost:3000/player', rank_data, function (result_data) {
				alert(result_data);

			});
			showScores();
		}

		E.$("#score_name").on("submit", function(e) {

			var rank_data = {"user_name":E.$("#name_player").val(), "user_score": score};
			$.post('http://localhost:3000/player', rank_data, function (result_data) {
				E.$("#scores_table").show();
				$.get('http://localhost:3000/ranking', {"limit":10}, function (result_data) {
					var topScores = "";
					var cpt = 1;
					for (var key in result_data) {
						if (result_data.hasOwnProperty(key)) {
							result_data[key]["user_name"];
							topScores = topScores + "<tr><th>" + cpt + "</th>" + "<td>" + result_data[key]["user_name"] + "</td>" + "<td>" + result_data[key]["user_score"] + "</td>" + "</tr>";
							cpt = cpt + 1;
						}
					}
					topScores = topScores + "<tr class='success'><th>Current Score</th>" + "<td>" + E.$("#name_player").val() + "</td>" + "<td>" + score + "</td>" + "</tr>";
					E.$("#scores_table tbody").html(topScores);
				});
			});
			E.$("#score_name").hide();
			return false;
		});

        function finishGame() {
			E.$("#difficulty").show();
            E.$("#country").hide();
            E.$("#play").show();

			E.$('#hscoresmark').tab('show');
			E.$("#score_name").show();
			E.$("#scores_table").hide();
        }

        function testAnswer(point) {
            var polyTab = getPolygonTab(rdm).intersectionGeometry;
            point = C.CoordinatesHelper.TransformTo(point, C.ProjectionsHelper.WGS84);
            var px = point.X;
            var py = point.Y;
            for (var i = 0; i < polyTab.length; ++i) {
                if (PolyK.ContainsPoint(polyTab[i], px, py)) {
                    console.log("WIN !");
                    return true;
                }
            }
            console.log("Mistake...");
            return false;
        }

        function addScore(TD) {
            console.log("Time " + TD);
            if (TD < 50000)
                score = score + 50000 - TD;
            E.$("#score").html("Score: <span style='color:green'>" + score + "</span>");
        }

        function mapClicked(evt) {
            if (evt)
            {
                var time = Date.now();
                var clickedPoint = evt.getWorldPosition();
				var result = testAnswer(clickedPoint);
                if (result) {
                    addScore(time - timestamp);
                }
                var country = data[rdm];
                var bounds = C.Bounds();
                for (var i = 0; i < country.polygons.length; ++i) {
                    bounds.extend(country.polygons[i].getBounds());
					if (result) {
						country.polygons[i].color(0x00ff00);
					} else {
						country.polygons[i].color(0xffff00);
					}
                    country.polygons[i].addTo(layer);
					console.log(country.polygons[i]);
                }
                C.Events.zoomToBounds(bounds);
                setEvent(false);
                setTimeout(function () {
                    C.Events.zoomToBounds(C.Bounds(C.Vector2(-50, -20), C.Vector2(50, 60), C.ProjectionsHelper.WGS84));
                    for (var i = 0; i < country.polygons.length; ++i) {
                        country.polygons[i].color(0xff0000);
                        layer.remove(country.polygons[i]);
                    }
                    if (counter > 0) {
                        newCountry();
                    } else {
                        finishGame();
                    }
                }, 2000);
            }
        }

        function setEvent(toggle) {
            if (toggle) {
                C.Events.on('mapClicked', mapClicked);
            } else {
                C.Events.off('mapClicked', mapClicked);
            }
        }


        function newCountry() {
            rdm = getRandomInt(0, data.length);
            console.log("country id: " + rdm);
            countryToFind = data[rdm].name;
            E.$("#country").text("Country to find: " + countryToFind);
            timestamp = Date.now();
            counter = counter - 1;
            setEvent(true);
        }


        function startGame() {
            score = 0;
			E.$("#difficulty").hide();
			E.$("#score").show();
            E.$("#score").text("Score: " + score);
            E.$("#country").show();
			counter = parseInt(E.$('input[name=options]:checked').val());
			console.log(counter);
            newCountry();
        }

        function getPolygon(id) {
            return data[id].geometry;
        }

        function getPolygonTab(id) {
            return data[id];
        }

		E.$("#country").hide();
		E.$("#score").hide();
		E.$("#score_name").hide();
		updateTop();
        E.$("#play").on("click", function() {
            $(this).hide();
            startGame();
        });

        E.ondestroy(function () {
            C.Events.off('mapClicked', mapClicked);
        });
    });
    E.Display('ui/index.tmpl');
});
