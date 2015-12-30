require(['lib/turf-min.js',
		'lib/simplify.js'], function (err, req) {
    if (err) {
        return console.error(err);
    }

	var simplify = req[1];

	//	Valeurs pour noel.
	var timeStampFuseaux = 3600000;													//	Valeur correcte: 3600000 (1h = 3600000 millisecondes)
	//	var timeStampChristmasFrance = 1450998000000 - 24 * timeStampFuseaux;		//	(paris minuit du 23 au 24)
	var timeStampChristmasFrance = 1450998000000;									//	Valeur correcte: 1450998000000 (paris minuit du 24 au 25)
//    var timeStampChristmasFrance = Date.now() + 10000 - 13 * timeStampFuseaux;

	//	Si set à true, tour expédié en environ 24 minutes à partir du moment ou c'est lancé.
	var fastTour = false;

	//	Affiche les lignes du trajet.
	var showLines = false;

	if (fastTour == true) {
		timeStampFuseaux = 600;
		timeStampChristmasFrance = Date.now() + 10000;
	}


	var line3 = {
	  "type": "Feature",
	  "properties": {
		"stroke": "#f00"
	  },
	  "geometry": {
		"type": "LineString",
		"coordinates": [
		  [-23.604262, -46.61499, 15],		//	Sao Polo Brésil		-3
		  [-34.560859, -58.249512, 15],		//	Buenos Aires Arg	-3
		  [-16.594081, -68.181152, 16],		// 	La Paz Bolivie		-4
		  [38.895, -77.037, 17],			// 	Washington USA		-5
		  [41.771312, -87.60498, 18],		// 	Chicago USA			-6
		  [19.394068, -99.074707, 18],		//	Mexico City Mexique	-6
		  [39.842286, -105.007324, 19],		//	Denver USA			-7
		  [37.775, -122.418, 20],			//	San Francisco USA	-8
		  [64.491725, -165.344238, 21],		// 	Nome alaska			-9

		]
	  }
	};

	var line2 = {
	  "type": "Feature",
	  "properties": {
		"stroke": "#f00"
	  },
	  "geometry": {
		"type": "LineString",
		"coordinates": [
		  [34.307144, 69.279785, 7],		//	Kaboul Afghanistan	5
		  [55.72711, 37.814941, 9],		//	Moscou Russie		3
		  [30.183122, 31.486816, 10],		//	Le Caire Egypte		2
		  [41.079351, 29.11377, 10],		//	Istanbul Turquie	2
		  [-34.161818, 18.325195, 10],		//	Le cap Affrique Sud	2
		  [52.48278, 13.469238, 11],		//	Berlin Allemagne	1
		  [48.719961, 2.263184, 11],		//	Paris France		1
		  [51.481383, -0.109863, 12],		//	Londres UK			0
		  [38.754083, -9.206543, 12],		//	Lisbonne Portugal	0
		  [15.072124, -23.137207, 13],		//	Cap Vert			-1
		  [-23.604262, -46.61499, 15],		//	Sao Polo Brésil		-3
		  ]
	  }
	};

	var line1 = {
	  "type": "Feature",
	  "properties": {
		"stroke": "#f00"
	  },
	  "geometry": {
		"type": "LineString",
		"coordinates": [
		  [-36.879621, 175.012207, 0],		//	Auckland			12
		  [-37.68382, 144.953613, 2],		//	Melbourne			10
		  [35.496456, 139.987793, 3],		//	Tokyo				9
		  [31.316101, 121.35498, 4],		//	Shanghai			8
		  [39.929, 116.388, 4],			//	Beijing				8
		  [22.187405, 114.147949, 4],		//	HongKong			8
		  [30.372875, 104.128418, 4],		//	Chengdu Chine		8
		  [1.318243, 103.820801, 4],		//	Singapour			8
		  [13.581921, 100.437012, 5],		//	Bangkok Thailande	7
		  [7.013668, 81.254883, 6],		//	Sri Lanka			6
		  [28.381735, 77.211914, 7],		//	New Delhi Inde		5
		  [34.307144, 69.279785, 7],		//	Kaboul Afghanistan	5
		]
	  }
	};


	function timeConverter(timestamp){
	  var a = new Date(timestamp);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	}

    function distanceBetween2Points(p1, p2) {
        var R = 6371000; // km
        var dLat = (p2.Y-p1.Y) * Math.PI / 180;
        var dLon = (p2.X-p1.X) * Math.PI / 180;
        var lat1 = (p1.Y) * Math.PI / 180;
        var lat2 = (p2.Y) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }


	function angle(cx, cy, ex, ey) {
		var dy = ey - cy;
		var dx = ex - cx;
		var theta = Math.atan2(dy, dx);
		return theta;
	}



	var curved = turf.bezier(line1);
	curved["geometry"]["coordinates"] = curved["geometry"]["coordinates"].concat(turf.bezier(line2)["geometry"]["coordinates"]);
	curved["geometry"]["coordinates"] = curved["geometry"]["coordinates"].concat(turf.bezier(line3)["geometry"]["coordinates"]);

//	console.log(curved);


	E.onload(function () {
		var layer = C.Layer();

		layer.addTo(E.map);

		var santaImg = C.Image({
			location: C.LatLng(0, 0),
			source: "assets/santa.png",
			width: 160,
			height: 80,
			anchorX: 0.5,
			anchorY: 0.5,
			rotation:30
		});
		santaImg.load();

		curved["location"] = []
		curved["timeStamp"] = []
		curved["dist"] = []
		for (var i = 0; i < curved["geometry"]["coordinates"].length; ++i) {
			curved["location"].push(C.LatLng(curved["geometry"]["coordinates"][i][0], curved["geometry"]["coordinates"][i][1]));
		}

		curved["location"] = simplify(curved["location"], 0.1);

		for (var i = 0; i < curved["location"].length; ++i) {
			curved["timeStamp"].push(-1);
			curved["dist"].push(0);
		}

		var sumDist = [];
		var cptTimeNow = 0;
		var cptSides = -1;
		var cptPrev = 0;
		var cptVal = 0;
		var currentLines = [line1["geometry"]["coordinates"], line2["geometry"]["coordinates"], line3["geometry"]["coordinates"]];
		var cpt = 0;
		var cptInit = currentLines[cpt][cptTimeNow];
		var prevTimestamp = timeStampChristmasFrance + (currentLines[0][0][2] - 13) * timeStampFuseaux;
		sumDist[0] = [0, "0", 0, 0];

		var shownTime = [];

		for (var j = 0; j < (curved["location"].length - 1); ++j) {
			if (cpt < 3 && curved["location"][j + 1].X < currentLines[cpt][cptTimeNow][1]) {
				cptTimeNow++;
				if (cptTimeNow == currentLines[cpt].length) {
					cpt++;
					cptTimeNow = 0;
					j--;
					continue;
				}
				if (currentLines[cpt][cptTimeNow][2] > cptPrev) {
					cptSides++;
					curved["timeStamp"][j] = prevTimestamp;
					shownTime.push(timeConverter(prevTimestamp));
					prevTimestamp = timeStampChristmasFrance + (currentLines[cpt][cptTimeNow][2] - 13) * timeStampFuseaux;
					sumDist[cptSides] = [0, cptPrev + " " + currentLines[cpt][cptTimeNow][2], distanceBetween2Points(C.LatLng(cptInit[0], cptInit[1]), C.LatLng(currentLines[cpt][cptTimeNow][0], currentLines[cpt][cptTimeNow][1])), prevTimestamp];
					cptPrev = currentLines[cpt][cptTimeNow][2];
					cptInit = currentLines[cpt][cptTimeNow];
				} else {
					sumDist[cptSides][2] += distanceBetween2Points(C.LatLng(cptInit[0], cptInit[1]), C.LatLng(currentLines[cpt][cptTimeNow][0], currentLines[cpt][cptTimeNow][1]));
					cptInit = currentLines[cpt][cptTimeNow];
				}
			}
			curved["dist"][j] = distanceBetween2Points(curved["location"][j], curved["location"][j + 1]);
			if (cptSides >= 0) {
				sumDist[cptSides][0] += curved["dist"][j];
			}
		}

		curved["timeStamp"][j] = prevTimestamp;
		shownTime.push(timeConverter(prevTimestamp));

		var prevTimeStamp = 0;
		var cptSides = -1;
		var milestone = 0;

		for (var j = 0; j < (curved["timeStamp"].length - 1); ++j) {
			if (curved["timeStamp"][j] != -1) {
				prevTimeStamp = curved["timeStamp"][j];
				milestone = prevTimeStamp;
				cptSides++;
			} else if (j > 0) {
				var dist = curved["dist"][j - 1];
				var distTotal = sumDist[cptSides][0];
				var percentage = dist / distTotal;
				curved["timeStamp"][j] = prevTimeStamp + percentage * (sumDist[cptSides][3] - prevTimeStamp);
				prevTimeStamp = curved["timeStamp"][j];
			}
		}


		if (showLines == true) {
			var npts = curved["location"];

			var lines = C.Line({
				locations: curved["location"],
				color: 0x0,
				opacity: 1
			});

			lines.addTo(layer);
		}

		var currentIndex = 0;

		var clearinterval = false;
		var maxTime = timeStampChristmasFrance + (currentLines[2][currentLines[2].length - 1][2] - 13) * timeStampFuseaux;
		var minTime = timeStampChristmasFrance + (currentLines[0][0][2] - 13) * timeStampFuseaux;
		var clearTime = false;
		var currentInterval = [0, 1];

		function findCurrentInterval() {
			var time = Date.now();

			for (var j = currentInterval[0]; j < (curved["timeStamp"].length - 1); ++j) {
				if (time > curved["timeStamp"][j] && time < curved["timeStamp"][j + 1]) {
					currentInterval = [j, j + 1];
					break;
				}
			}

		}

		var gifts = 0;
		function updatePosition() {
			var totalTime = curved["timeStamp"][currentInterval[1]] - curved["timeStamp"][currentInterval[0]];
			var doneTime = Date.now() - curved["timeStamp"][currentInterval[0]];
			var percentage = doneTime / totalTime;
			var distanceFromPoint = curved["dist"][currentInterval[0]] * Date.now() + curved["timeStamp"][currentInterval[1]];
			gifts = Date.now() - minTime;

			gifts = Math.floor(gifts);

			return C.LatLng(curved["location"][currentInterval[0]].Y + percentage * (curved["location"][currentInterval[1]].Y - curved["location"][currentInterval[0]].Y), curved["location"][currentInterval[0]].X + percentage * (curved["location"][currentInterval[1]].X - curved["location"][currentInterval[0]].X));
		}

		var interval_update = setInterval(refresh, 25);
		clearinterval = true;

		function refresh() {
			if (maxTime < Date.now()) {
				clearInterval(interval_update);
				clearinterval = false;
				layer.remove(santaImg);
				return ;
			} else if (!clearTime && minTime > Date.now()){
				return ;
			} else if (!clearTime) {
				findCurrentInterval();
				clearTime = true;
				santaImg.addTo(layer);
				E.$('.timer').hide();
			}

			findCurrentInterval();
			santaImg.location(updatePosition());
			santaImg.rotation(-(angle(curved["location"][currentInterval[0]].X, curved["location"][currentInterval[0]].Y, curved["location"][currentInterval[1]].X, curved["location"][currentInterval[1]].Y)));

			E.$('.gifts').text("Santa has given " + gifts + "\tgifts !");
		}

		function pretty_time_string(num) {
			return ( num < 10 ? "0" : "" ) + num;
		}

		var timer;

		function launchTimer() {
			var start = Date.now();

            console.log('launch timer', (minTime - Date.now()) / 1000);
			timer = setInterval(function() {
				var total_seconds = (minTime - Date.now()) / 1000;

				if (total_seconds <= 0) {
                    minTime = timeStampChristmasFrance + (currentLines[0][0][2] - 13) * timeStampFuseaux;
					clearInterval(timer);
					E.$('.timer').hide();
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

				var currentTimeString = hours + ":" + minutes + ":" + seconds;

				E.$('.timer').text(currentTimeString);

			}, 1000);
		}

        console.log(maxTime, minTime, Date.now());
		if (maxTime > Date.now()) {
			if (minTime < Date.now()) {
				clearTime = true
				findCurrentInterval();
				santaImg.addTo(layer);
			} else {
				launchTimer();
			}
		} else {
            E.$('.gifts').text('Santa Claus is gone !');
        }

		E.ondestroy(function() {
			if (clearinterval == true) {
				clearInterval(interval_update);
			}
		})

	});
});
