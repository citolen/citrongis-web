require('lib/citrongis.cluster.js', function (err, Cluster) {

    var contracts = {};
    var farContracts = {};

    var baseLayer = new Cluster();

    baseLayer.addTo(E.map);

    var createReference = function (context, func) {
        return function () { return func.call(context); }
    };

    var velibImage = "https://mt0.google.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=2";


    function removeContract(contract) {
        var currentContract = contracts[contract];
        var stationsToRemove = [];
        for (var i = 0; i < currentContract.length; ++i) {
            stationsToRemove.push(currentContract[i]["station"]);
        }
        baseLayer.remove(stationsToRemove);
    }

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + 'h' + min;
        return time;
    }

    function loadStation(contract, number) {
        var req = new XMLHttpRequest();
        req.open('GET', 'https://api.jcdecaux.com/vls/v1/stations/' + number + '?contract=' + contract + '&apiKey=e05c3a4db316832c1abf904b999ed42fc7088e21', false);
        req.send(null);

        return JSON.parse(req.responseText);
    }

    function loadContract(contract) {
        if (contracts[contract]) {
            var currentContract = contracts[contract];
            var toAdd = [];
            for (var i = 0; i < currentContract.length; ++i) {
                toAdd.push(currentContract[i]["station"]);
            }
            baseLayer.add(toAdd);
            C.Events.zoomToBounds(baseLayer.getBounds());
        } else {
            $.get('https://api.jcdecaux.com/vls/v1/stations?contract=' + contract + '&apiKey=e05c3a4db316832c1abf904b999ed42fc7088e21', function (contract, velib_stations) {
                contracts[contract] = [];
                var markers = [];
                var oldContract = contract;
                var currentContract = contracts[contract];
                var contract = velib_stations;
                for (var i = 0; i < contract.length; ++i) {
                    var station = C.Image({
                        location: C.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
                        source:"assets/marker-icon.png"/*"http://leafletjs.com/dist/images/marker-icon.png"/*"https://mt0.google.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=2"*/,
                        anchorY:1,
                        anchorX:0.5,
                        width:25,
                        height:41,
                        scaleMode: C.ImageScaleMode.NEAREST
                    });

                    station.load();

                    station.set("number", contract[i]["number"]);
                    station.set("contract", contract[i]["contract_name"]);

                    station.on("click", function(feature, event) {
                        if (this.get("popup")) {
                            this.get("popup").close();
                        }
                        var contentString = loadStation(this.get("contract"), this.get("number"));

                        var colorBikes = "success";
                        var colorStands = "success";
                        var colorStatus = "success";
                        if (contentString["available_bikes"] == 0)
                            colorBikes = "danger";
                        if (contentString["available_bike_stands"] == 0)
                            colorStands = "danger";
                        if (contentString["status"] != "OPEN")
                            colorStatus = "danger";

                        contentString = '<h1>Station ' + contentString["name"] + '</h1><table class="table table-bordered text-center"><thead><tr><th>#</th><th>Vélos libres</th><th>Places libres</th></tr></thead><tbody><tr><th><img src="{@image src="assets/parking3.png" /}" /></th><td class="' + colorBikes + '">' + contentString["available_bikes"] + '</td><td class="' + colorStands + '">' + contentString["available_bike_stands"] + '</td></tr><tr><th><img src="{@image src="assets/clock104.png" /}" /></th><td colspan="2" class="' + colorStatus + '">' + contentString["status"] + '</td></tr></tbody></table>Dernière mise à jour: ' + timeConverter(contentString["last_update"]) + '';

                        var p = C.Popup(this, {
                            content: contentString,
                            auto: false
                        });
                        p.open(event);
                        this.set("popup", p);
                    });

                    markers.push(station);
                    currentContract.push({"name" : contract[i]["name"], "station" : station});
                }

                baseLayer.add(markers);
                C.Events.zoomToBounds(baseLayer.getBounds());
            }.bind(null, contract));
        }
    }

    function loadContracts(callback) {
        $.get('https://api.jcdecaux.com/vls/v1/contracts?apiKey=e05c3a4db316832c1abf904b999ed42fc7088e21', function (contract) {
            var area = E.$('#velib_list');
            for (var i = 0; i < contract.length; ++i) {
                area.html(area.html() + '<div class="velib-ui-cat"><i class="fa fa-square-o"></i><span>' + contract[i]["name"] + '</span></div>');
            }
            callback();
        })
    }

    E.onload(function() {
        loadContracts(function () {
            $('.velib-ui-cat').on('click', function (e) {
                if (!$(this).find('i').hasClass('fa-check-square-o')) {
                    $(this).find('i').addClass('fa-check-square-o');
                    $(this).find('i').removeClass('fa-square-o');
                    loadContract($(this).children('span').text());
                } else {
                    $(this).find('i').removeClass('fa-check-square-o');
                    $(this).find('i').addClass('fa-square-o');
                    removeContract($(this).children('span').text());
                }
            });
        });
    });

    E.Display('ui/index.tmpl');
});
