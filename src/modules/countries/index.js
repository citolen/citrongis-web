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
            country.polygons.push(poly);
        }
        country.intersectionGeometry = intersectionGeo;
    }

    var score = 0;

    var countryToFind;
    var rdm = 0;

    var timestamp;
    var counter = 10;
    var playing = false;

    var found_countries = [];

    var difficulty = 1;
    var server_url = 'http://52.10.137.45:8082';

    E.onload(function () {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function updateTop() {

            E.$("#scores_table").show();
            $.get(server_url + '/ranking', {"limit":10}, function (result_data) {
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

            E.$("#score_name_player").show();
            var rank_data = {"user_name":"brice", "user_score": score};
            $.post(server_url + '/player', rank_data, function (result_data) {
                alert(result_data);

            });
            showScores();
        }

        E.$("#score_name_player").on("submit", function(e) {

            var rank_data = {"user_name":E.$("#name_player").val(), "user_score": score};
            $.post(server_url + '/player', rank_data, function (result_data) {
                E.$("#scores_table").show();
                $.get(server_url + '/ranking', {"limit":10}, function (result_data) {
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
            E.$("#score_name_player").hide();
            return false;
        });


        function testCountry(value) {

            for (var i = 0; i < found_countries.length; ++i) {
                for (var j = 0; j < data[found_countries[i]]["name"].length; ++j) {
                    var areEqual = data[found_countries[i]]["name"][j].toUpperCase() === value.toUpperCase();
                    if (areEqual) {
                        return false;
                    }
                }
            }

            for (var i = 0; i < data.length; ++i) {
                var country = data[i];
                for (var j = 0; j < country["name"].length; ++j) {
                    var areEqual = country["name"][j].toUpperCase() === value.toUpperCase();

                    if (areEqual) {
                        found_countries.push(i);
                        return i;
                    }
                }
            }
            return false;
        }

        function draw_country(result) {
            var country = data[result];
            for (var i = 0; i < country.polygons.length; ++i) {
                country.polygons[i].color(0x00ff00);
                country.polygons[i].addTo(layer);
                //				console.log(country.polygons[i]);
            }
        }

        E.$("#score_name").on("submit", function(e) {

            if (!playing) {
                return false;
            }

            var country = E.$("#name_country").val();
            E.$("#name_country").val("");

            if (!country.length) {
                return false;
            }

            var result = testCountry(country);
            if (result !== false) {
                E.$("#lastcountry").html(country);
                E.$("#lastcountry").addClass("text-success");
                E.$("#lastcountry").addClass("bg-success");
                E.$("#lastcountry").removeClass("bg-danger");
                E.$("#lastcountry").removeClass("text-danger");
                draw_country(result);
                addScore(1 * difficulty);
            } else {
                E.$("#lastcountry").html(country);
                E.$("#lastcountry").addClass("text-danger");
                E.$("#lastcountry").addClass("bg-danger");
                E.$("#lastcountry").removeClass("bg-success");
                E.$("#lastcountry").removeClass("text-success");
            }
            return false;
        });

        function addScore(TD) {
            score = score + TD;
            E.$("#score").html("Score: <span style='color:green'>" + score + "</span>");
        }

        var timer;

        function launchTimer() {
            var start = new Date;

            timer = setInterval(function() {
                var total_seconds = (counter * 60) - (new Date - start) / 1000;

                if (total_seconds <= 0) {
                    endGame();
                    return ;
                }
                var hours = Math.floor(total_seconds / 3600);
                total_seconds = total_seconds % 3600;

                var minutes = Math.floor(total_seconds / 60);
                total_seconds = total_seconds % 60;

                var seconds = Math.floor(total_seconds);

                hours = pretty_time_string(hours);
                minutes = pretty_time_string(minutes);
                seconds = pretty_time_string(seconds);

                var currentTimeString = minutes + ":" + seconds;

                E.$('.timer').text(currentTimeString);

            }, 1000);
        }

        function endGame() {

            clearInterval(timer);
            E.$("#score").html("Last score: <span style='color:green'>" + score + "</span>");
            for (var j = 0; j < found_countries.length; ++j) {
                var country = data[found_countries[j]];
                for (var i = 0; i < country.polygons.length; ++i) {
                    layer.remove(country.polygons[i]);
                    //					console.log(country.polygons[i]);
                }
            }
            playing = false;
            E.$("#score_name").hide();
            E.$("#difficulty").show();
            E.$("#play").show();

            E.$("#lastcountry").hide();
            E.$('#hscoresmark').tab('show');
            E.$("#score_name_player").show();
            E.$("#scores_table").hide();

            E.$('.timer').hide();
        }

        function startGame() {
            score = 0;
            E.$("#lastcountry").show();
            E.$("#lastcountry").html("").show();
            E.$("#lastcountry").removeClass("bg-danger");
            E.$("#lastcountry").removeClass("text-danger");
            E.$("#lastcountry").removeClass("bg-success");
            E.$("#lastcountry").removeClass("text-success");

            E.$("#difficulty").hide();
            E.$("#score").show();
            E.$("#score_name").show();
            E.$("#score").text("Score: " + score);
            E.$('.timer').show();
            counter = parseInt(E.$('input[name=options]:checked').val());
            difficulty = 1;
            found_countries = [];
            playing = true;
            launchTimer();

        }

        E.$("#score_name_player").hide();
        E.$("#score_name").hide();
        E.$("#score").hide();
        E.$("#lastcountry").hide();
        updateTop();

        function pretty_time_string(num) {
            return ( num < 10 ? "0" : "" ) + num;
        }

        E.$("#play").on("click", function() {
            C.Events.zoomToBounds(C.Bounds(C.LatLng(-30, -70), C.LatLng(70, 70)));
            $(this).hide();
            startGame();
        });

        E.ondestroy(function () {
            if (playing) {
                clearInterval(timer);
            }
        });
    });
    E.Display('ui/index.tmpl');
});
