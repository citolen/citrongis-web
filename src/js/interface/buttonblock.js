/*
 *  buttonblock.js  //TODO description
 */

var C = C || {};

C.Interface.ButtonBlock = C.Utils.Inherit(function (base, options) {

    base(options);

    this._container.classList.add('grid-button-block');

    var self = this;
    $(this._container).click(function (event) {
        self.emit('click', event.originalEvent);
    });

}, C.Interface.Block, 'C.Interface.ButtonBlock');
