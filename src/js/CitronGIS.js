/*
**
**  CitronGIS.js
**
**  Author citolen
**  27/12/2014
**
*/

var C = C || {};

C.CitrongGIS = function (rootDIV) {

    'use strict';

    this._rootDiv = rootDIV;
};

C.CitrongGIS.prototype.loadExtension = function (file) {

    'use strict';

    var self = this;
    var reader = new FileReader();

    reader.onload = function() {

        var extZip = new JSZip();
        extZip.load(reader.result);

        var e = new C.Extension.Extension(extZip);
        C.Extension.Manager.register(e);

        e.module.ui.on('display', function (element) {
            var container = document.createElement('DIV');
            container.appendChild(element);
            container.className = "extension-container";

            self._rootDiv.appendChild(container);
            $(container).draggable({ containment: "#citrongis", scroll: false });
        });

        e.run();
    };

    reader.readAsArrayBuffer(file);
};
