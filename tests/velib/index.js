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


			var station = new C.Geo.Feature.Image({
				location: new C.Geometry.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
				source:"http://a.tile.openstreetmap.org/15/16596/11280.png",
				anchorY:0.5,
				anchorX:0.5,
				width:30,
				height:36,
				opacity:1,
				scaleMode: (C.Utils.Comparison.Equals(C.Helpers.viewport._rotation, 0)) ? C.Geo.Feature.Image.ScaleMode.NEAREST : C.Geo.Feature.Image.ScaleMode.DEFAULT
			});
/*			var station = new C.Geo.Feature.Circle({
				radius: 5,
				location: new C.Geometry.LatLng(contract[i]["position"]["lat"], contract[i]["position"]["lng"]),
				outlineColor: 0xBF4E6C,
				backgroundColor: 0xffffff,
				outlineWidth: 3
			});*/
			station.load();
			currentContract.push({"name" : contract[i]["name"], "station" : station});
			baseLayer.addFeature(station);
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
