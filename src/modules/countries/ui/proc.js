var data = require('./test.json');
var simplify = require('simplify');

var all_countries = data["features"];
var totalPoint = 0;
var totalTest = 0;

var outputCountries = [];

for (var x = 0; x < all_countries.length; ++x) {

        var country = {
            name: all_countries[x]["properties"]["name"],
            geometry: []
        };
        var geometry = all_countries[x]["geometry"];

        if (geometry.geometries) {
            var geometries = geometry.geometries;
            for (var i = 0; i < geometries.length; ++i) {
                    var coordinates = geometries[i].coordinates;
                    coordinates = coordinates[0];
                    var geo = [];
                    for (var j = 0; j < coordinates.length; ++j) {
                        geo.push([coordinates[j][0], coordinates[j][1]]);
                    }
                    country.geometry.push(geo);
            }
        } else {
            var coordinates = geometry.coordinates;
            coordinates = coordinates[0];
            var geo = [];
            for (var i = 0; i < coordinates.length; ++i) {
                geo.push([coordinates[i][0], coordinates[i][1]]);
            }
            country.geometry.push(geo);
        }
        outputCountries.push(country);
}

require('fs').writeFile('./output.json', JSON.stringify(outputCountries), function () {
   console.log('done');
});
