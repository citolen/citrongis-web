var contracts = {};
var farContracts = {};

var group = module.layerHelper.createGroup({
    name: 'Invisible_distance_ui'
});

var baseLayer = new C.Geo.Layer({

});

var farLayer = new C.Geo.Layer({

});

group.addLayer(baseLayer);
group.addLayer(farLayer);

var createReference = function (context, func) {
    return function () { return func.call(context); }
};

var velibImage = "https://mt0.google.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=2";


function removeContract(contract) {
	var currentContract = contracts[contract];
	for (var i = 0; i < currentContract.length; ++i) {
		baseLayer.removeFeature(currentContract[i]["station"]);
	}
	farLayer.removeFeature(farContracts[contract]);
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
		farLayer.addFeature(farContracts[contract]);
	} else {
		contracts[contract] = [];
		var oldContract = contract;
		var currentContract = contracts[contract];
		var contract = JSON.parse(req.responseText);
		for (var i = 0; i < contract.length; ++i) {

		if (i == 0) {
			farContracts[oldContract] = new C.Geo.Feature.Image({
				location: new C.Geometry.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
				source:"https://mt0.google.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=4",
				anchorY:1,
				anchorX:0.5,
				width:44,
				height:80,
				opacity:1,
				scaleMode: (C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT
			});
			farContracts[oldContract].load();
			farLayer.addFeature(farContracts[oldContract]);
		}
		
		var width = 11;
		var height = 20;
		if (C.Helpers.viewport._resolution < 20 && C.Helpers.viewport._resolution > 5) {
			width = 22;
			height = 40;
		} else if (C.Helpers.viewport._resolution < 5){
			width = 44;
			height = 80;
		}
			
			var station = new C.Geo.Feature.Image({
				location: new C.Geometry.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
				source:"https://mt0.google.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=2",
				anchorY:1,
				anchorX:0.5,
				width:width,
				height:height,
				opacity:1,
				scaleMode: (C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT
			});

			station.load();
			station.set("number", contract[i]["number"]);
			station.set("contract", contract[i]["contract_name"]);
			baseLayer.addFeature(station);
					
			station.on("click", function(feature, event) {
				

				if (C.Helpers.viewport._resolution >= 100)
					return ;
				if (this.get("popup")) {
					this.get("popup").close();
				}
				var contentString = loadStation(this.get("contract"), this.get("number"));
				
				contentString = '<div><h1>Station ' + contentString["name"] + '</h1><div>Nombre de vélo libres: ' + contentString["available_bikes"] + '<br/>Nombre de places libres: ' + contentString["available_bike_stands"] + '<br/>Status: ' + contentString["status"] + '<br/>Dernière mise à jour: ' + timeConverter(contentString["last_update"]) + '<br/></div></div>';
					var p = new C.UI.Popup(this, {
					content: contentString,
					auto: false
				});
				p.open(event);
				this.set("popup", p);
			});
			currentContract.push({"name" : contract[i]["name"], "station" : station});
		}
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


module.ui.display('ui/index.tmpl');


$(document).ready(function() {
	loadContracts();
	$('#velib_window').on('click', '.velib-ui-cat', function (e) {
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

	var previousRes = C.Helpers.viewport._resolution;
	
    C.Helpers.viewport.on('resolutionChange', function () {
		if (C.Helpers.viewport._resolution > 5 && previousRes <= 5)
			for (var j = baseLayer._features.length - 1; j >= 0; --j) {
				console.log(baseLayer._features[j])
				
				baseLayer._features[j]._width = 22;
				baseLayer._features[j]._height = 40;
				baseLayer._features[j].load();
			} 

		else if (C.Helpers.viewport._resolution < 20 && previousRes >= 20)
			for (var j = baseLayer._features.length - 1; j >= 0; --j) {
				console.log(baseLayer._features[j])
				
				baseLayer._features[j]._width = 22;
				baseLayer._features[j]._height = 40;
				baseLayer._features[j].load();
			} 

		else if (C.Helpers.viewport._resolution < 5 && previousRes >= 5)
			for (var j = baseLayer._features.length - 1; j >= 0; --j) {
				console.log(baseLayer._features[j])
				
				baseLayer._features[j]._width = 44;
				baseLayer._features[j]._height = 80;
				baseLayer._features[j].load();
			} 

		else if (C.Helpers.viewport._resolution > 20 && previousRes <= 20)
			for (var j = baseLayer._features.length - 1; j >= 0; --j) {
				console.log(baseLayer._features[j])
				
				baseLayer._features[j]._width = 11;
				baseLayer._features[j]._height = 20;
				baseLayer._features[j].load();
			}

		if (C.Helpers.viewport._resolution > 100 && previousRes <= 100) {
			baseLayer.opacity(0);
			farLayer.opacity(1);
		} else if (C.Helpers.viewport._resolution < 100 && previousRes >= 100){
			baseLayer.opacity(1);
			farLayer.opacity(0);
		}

		previousRes = C.Helpers.viewport._resolution;
	});
});

