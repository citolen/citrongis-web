/*
 *  featureupdated.js  Feature updated
 */

var self = this;
var onfeatureupdated;

require(['models/QueryFormatter.js'], function (err, models) {
    var Formatter = models[0];
    onfeatureupdated = function (client, data) {
        var id = data.payload.id;
        var feature = self.manager._features[data.payload._id];
        if (!feature) { return; }
        Formatter.updateWithData(feature._feature._feature, data.payload._featureData);
    };
});

function setup(client) {
    client._socket.on('featureupdated', onfeatureupdated.bind(self, client));
}

module.exports = {
    setup: setup
};
