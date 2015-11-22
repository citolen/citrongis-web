/*
 *  welcome.js  Welcome message
 */

var self = this;
var onwelcome;

require(['models/Client.js',
         'models/Feature.js',
         'models/QueryFormatter.js'], function (err, models) {
    if (err) {
        return console.error(err);
    }
    var Client = models[0];
    var Feature = models[1];
    var Formatter = models[2];

    onwelcome = function (client, data) {
        E.$('#client_id').html(data.id);
        E.$('#client_map').text(data.map);

        self.client.setId(data.id);

        var clients = data.clients;
        for (var i = 0; i < clients.length; ++i) {
            self.manager.registerClient(Client({
                id: clients[i].id,
                viewport: clients[i].viewport
            }), function () {

            });
        }

        var features = data.features;
        for (var i = 0; i < features.length; ++i) {
            var featurePayload =    features[i];
            var featureId =         featurePayload._id;
            var featureCreator =    featurePayload._creator;
            var featureData =       featurePayload._featureData;

            var feature = Formatter.featureFromData(featureData);
            var objFeature = Feature({
                id: featureId,
                creator: featureCreator,
                feature: feature
            });
            self.manager._addFeature(objFeature);
        }

        self.manager.sendViewport();
    }

});

function setup(client) {
    client._socket.on('welcome', onwelcome.bind(self, client));
}

module.exports = {
    setup: setup
};
