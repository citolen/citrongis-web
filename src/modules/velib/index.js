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
        var req = new XMLHttpRequest();
        req.open('GET', 'https://api.jcdecaux.com/vls/v1/stations?contract=' + contract + '&apiKey=e05c3a4db316832c1abf904b999ed42fc7088e21', false);
        req.send(null);
        if (contracts[contract]) {
            var currentContract = contracts[contract];
            for (var i = 0; i < currentContract.length; ++i) {
                baseLayer.addFeature(currentContract[i]["station"]);
            }
        } else {
            contracts[contract] = [];
            var markers = [];
            var oldContract = contract;
            var currentContract = contracts[contract];
            var contract = JSON.parse(req.responseText);
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


//                    if (C.Viewport._resolution >= 100) {
//                        return ;
//                    }
                    if (this.get("popup")) {
                        this.get("popup").close();
                    }
                    var contentString = loadStation(this.get("contract"), this.get("number"));

                    contentString = '<div><h1>Station ' + contentString["name"] + '</h1><div>Nombre de vélo libres: ' + contentString["available_bikes"] + '<br/>Nombre de places libres: ' + contentString["available_bike_stands"] + '<br/>Status: ' + contentString["status"] + '<br/>Dernière mise à jour: ' + timeConverter(contentString["last_update"]) + '<br/></div></div>';
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
        }
    }

    function loadContracts() {
        var req = new XMLHttpRequest();
        req.open('GET', 'https://api.jcdecaux.com/vls/v1/contracts?apiKey=e05c3a4db316832c1abf904b999ed42fc7088e21', false);
        req.send(null);
        var contract = JSON.parse(req.responseText);
        var area = document.getElementById('velib_list');
        for (var i = 0; i < contract.length; ++i) {
            area.innerHTML = area.innerHTML + '<div class="velib-ui-cat"><i class="fa fa-square-o"></i><span>' + contract[i]["name"] + '</span></div>';
        }
    }

    E.onload(function() {
        loadContracts();
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

    E.Display('ui/index.tmpl');
});
