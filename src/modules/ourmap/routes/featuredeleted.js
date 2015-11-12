/*
 *  featureadded.js  Feature added
 */

var self = this;
var onfeaturedeleted;

onfeaturedeleted = function (client, data) {
    var id = data.payload.id;
    self.manager.removeFeature(id);
};

function setup(client) {
    client._socket.on('featuredeleted', onfeaturedeleted.bind(self, client));
}

module.exports = {
    setup: setup
};
