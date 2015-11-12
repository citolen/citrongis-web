/*
 *  client.js  Client connection/disconnect
 */

var self = this;
var onnewclient;
var onclientgone;

require('models/Client.js', function (err, Client) {

    onnewclient = function (client, data) {
        self.manager.registerClient(Client({
            id: data.id
        }));
    };

    onclientgone = function (client, data) {
        self.manager.unregisterClient(data.id);
    };

});

function setup(client) {
    client._socket.on('newclient', onnewclient.bind(self, client));
    client._socket.on('clientgone', onclientgone.bind(self, client));
}

module.exports = {
    setup: setup
};
