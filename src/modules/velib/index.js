var contracts = {};

var group = module.layerHelper.createGroup({
    name: 'Invisible_distance_ui'
});

var baseLayer = new C.Geo.Layer({

});

group.addLayer(baseLayer);



function removeContract(contract) {
	var currentContract = contracts[contract];
	for (var i = 0; i < currentContract.length; ++i) {
//		alert('YES' + i + " " + currentContract.length);
		baseLayer.removeFeature(currentContract[i]["station"]);
	}
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
		var currentContract = contracts[contract];
		var contract = JSON.parse(req.responseText);
		for (var i = 0; i < contract.length; ++i) {


			var station = new C.Geo.Feature.Circle({
				radius: 5,
				location: new C.Geometry.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
				outlineColor: 0xBF4E6C,
				backgroundColor: 0xffffff,
				outlineWidth: 3
			});
			
			station.set("number", contract[i]["number"]);
			station.set("contract", contract[i]["contract_name"]);
			baseLayer.addFeature(station);
			station.on('click', function() {
				
				var popup = this.get("popup");
				
				if (popup == null) {
					console.log(this);
					console.log(this.get("contract"));
					
					var contentString = loadStation(this.get("contract"), this.get("number"));
					
					contentString = '<div><h1>Station ' + contentString["name"] + '</h1><div>Nombre de vélo libres: ' + contentString["available_bikes"] + '<br/>Nombre de places libres: ' + contentString["available_bike_stands"] + '<br/>Status: ' + contentString["status"] + '<br/>Dernière mise à jour: ' + timeConverter(contentString["last_update"]) + '<br/></div></div>';
					var p = new C.UI.Popup(this, {
						content: contentString,
						auto: false
					});
					this.set("popup", p);
					p.open();
				} else {
					if (popup.isOpen()) {
						popup.close();
					} else {
						popup.open();
					}
				}
			});
			var station = new C.Geo.Feature.Image({
				location: new C.Geometry.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
				source:"https://mt0.google.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=2",
				anchorY:1,
				anchorX:0.5,
				width:44,
				height:80,
				opacity:1,
				scaleMode: (C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT
			});
			station.load();
//			currentContract.push({"name" : contract[i]["name"], "station" : station});
			baseLayer.addFeature(station);
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

	var tile = new C.Geo.Feature.Image({
	location: new C.Geometry.LatLng(0, 0),
	width: 256,
	height: 256,
	scaleY: 0.5,

	scaleMode: (C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT,
	source: 'http://c.tile.openstreetmap.org/0/0/0.png'
	});

	baseLayer.addFeature(tile);
});
