/*
 *  featureadded.js  Feature added
 */

var self = this;
var onfeatureadded;

require(['models/QueryFormatter.js',
         'models/Feature.js'], function (err, models) {
    var Formatter = models[0];
    var Feature = models[1];

    onfeatureadded = function (client, data) {
        if (data.id == client._id) { // self message
            var feature = self.manager._features[data.payload.temp_id];
            delete self.manager._features[data.payload.temp_id];
            feature._id = data.payload.feature_id;
            self.manager._features[feature._id] = feature;
        } else {
            var featureId = data.payload._id;
            var featureCreator = data.payload._creator;
            var featureData = data.payload._featureData;

            var feature = Formatter.featureFromData(featureData);
            var objFeature = Feature({
                id: featureId,
                creator: featureCreator,
                feature: feature
            });
            self.manager._addFeature(objFeature);
        }
    };
});


function setup(client) {
    client._socket.on('featureadded', onfeatureadded.bind(self, client));
}

module.exports = {
    setup: setup
};
