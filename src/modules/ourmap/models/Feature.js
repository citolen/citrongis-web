/*
 *  Feature.js  Represent a feature (abstract, not a real displayable feature)
 */

'use strict';

var root = this;

var Feature = C.Utils.Inherit(function (base, options) {
    base();
    options = options || {};

    this._id = options.id;

    this._creator = options.creator;

    this._feature = root.Editable(options.feature);

    this._popup;

    this._clickFct = this._click.bind(this);
    this._mapClickedFct = this._mapClicked.bind(this);

    this._feature._feature.on   ('click', this._clickFct);
    this._feature._feature.on   ('removed', function () {
        if (this._popup) { this._popup.close(); }
        C.Events.off('mapClicked', this._mapClickedFct);
    }.bind(this));
}, EventEmitter);

Feature.prototype._mapClicked = function () {
    this._feature.done();
    C.Events.off('mapClicked', this._mapClickedFct);
    root.manager.updateFeature(this._id);
    this.emit('done', self);
};

Feature.prototype._click = function (f, evt) {
    if (!this._popup) {
        var self = this;
        this._popup = C.Popup(this._feature._feature, {
            content: '<button class="edit"><i class="fa fa-pencil"></i></button><button class="delete"><i class="fa fa-trash-o"></i></button>',
            initialized: function (popup) {
                popup.$('.edit').click(function () {
                    self._feature.edit();
                    self._popup.close();
                    C.Events.on('mapClicked', self._mapClickedFct);
                    self.emit('edit', self);
                });

                popup.$('.delete').click(function () {
                    root.manager.removeFeature(self._id);
                });
            }
        });
    }
    if (!this._feature._isEditing) {
        this._popup.open(evt);
    }
};

require('models/QueryFormatter.js', function (err, formatter) {

    Feature.prototype.getData = function () {
        return formatter.formatFeature(this._feature._feature);
    };

});

function ctr(args) {
    return Feature.apply(this, args);
}
ctr.prototype = Feature.prototype;
module.exports = function () {
    return new ctr(arguments);
};
