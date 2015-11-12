/*
 *  welcome.js  Welcome message
 */

var self = this;
var onwelcome;

require('models/Client.js', function (err, Client) {

    onwelcome = function (client, data) {
        E.$('#client_id').html(data.id);
        E.$('#client_map').text(data.map);

        self.client.setId(data.id);

        var clients = data.clients;
        for (var i = 0; i < clients.length; ++i) {
            self.manager.registerClient(Client({
                id: clients[i].id,
                viewport: clients[i].viewport
            }));
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
