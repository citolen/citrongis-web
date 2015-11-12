/*
 *  viewport.js  Viewport update
 */

var self = this;
var onviewportupdated;

onviewportupdated = function (client, data) {
    var otherclient = self.manager.getClientById(data.id);
    if (!otherclient) { return; }

    otherclient.setViewport(data.payload);
    self.manager.displayClientViewport(otherclient);
};

function setup(client) {
    client._socket.on('viewportupdated', onviewportupdated.bind(self, client));
}

module.exports = {
    setup: setup
};
