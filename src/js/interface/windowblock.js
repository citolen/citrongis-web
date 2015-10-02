/*
 *  window.js  //TODO description
 */

var C = C || {};

C.Interface.WindowBlock = C.Utils.Inherit(function (base, options) {

    base(options);

    this._container.classList.add('window-block');

    var self = this;

}, C.Interface.Block, 'C.Interface.WindowBlock');
