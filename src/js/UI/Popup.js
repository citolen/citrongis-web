/*
**
**  Popup.js
**
**
*/

var C = C || {};
C.UI = C.UI || {};

C.UI.Popup = function (feature, options) {

    'use strict';

    options = options || {};

    this.feature = feature;

    this.dom = document.createElement('div');
    this.dom.className = 'popup-container';

    var wrapper = document.createElement('div');
    wrapper.className = 'popup-wrapper';

    wrapper.innerHTML = options.content;

    var tip = document.createElement('div');
    tip.className = 'popup-tip-container';
    tip.innerHTML = '<div class="popup-tip"></div>';

    var close = document.createElement('a');
    close.innerHTML = 'x';
    close.className = 'popup-close';
    close.href = '#';

    var self = this;
    close.addEventListener('click', function () {
        self.close();
    });

    this.dom.appendChild(wrapper);
    this.dom.appendChild(tip);
    this.dom.appendChild(close);

    if (options.auto)
        this.open();
};

C.UI.Popup.prototype.open = function () {

    'use strict';

    C.UI.PopupManager.register(this);

};

C.UI.Popup.prototype.close = function () {

    'use strict';

    C.UI.PopupManager.unregister(this);
};
