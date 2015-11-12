/*
 *  Client.js   client model
 */

var Client = function (options) {
    options = options || {};

    this._socket =      options.socket;

    this._id =          options.id;

    this._viewport =    options.viewport;
};

Client.prototype.setId = function (id) {
    this._id = id;
};

Client.prototype.setViewport = function (viewport) {
    this._viewport = viewport;
};

function ctr(args) {
    return Client.apply(this, args);
}
ctr.prototype = Client.prototype;
module.exports = function () {
    return new ctr(arguments);
};
