var self = this;
require(['lib/ace/ace.js',
         'lib/ace/mode-javascript.js',
         'lib/ace/mode-html.js',
         'lib/ace/mode-css.js',
         'lib/ace/theme-tomorrow.js',
         'lib/ace/ext-emmet.js',
         'lib/ace/ext-language_tools.js',
         'lib/semantic/semantic.js'
        ], function (err) {
    require('editor_handler.js', function (err, EditorHandler) {

        var extension;

        var snippets = [
            'var my_data_layer = C.Layer();\nmy_data_layer.addTo(E.map);\n\nE.onload(function () {\n\tvar bounds = C.Bounds(C.LatLng(-40, -40), C.LatLng(40,40));\n\tC.Events.zoomToBounds(bounds);\n\tE.$(\'#my_button\').click(function () {\n\t\tvar lat = Math.random() * 80 - 40;\n\t\tvar lon = Math.random() * 80 - 40;\n\n\t\tvar random_location = C.Circle({\n\t\t\tlocation: C.LatLng(lat, lon),\n\t\t\tradius: 10,\n\t\t\tcolor: 0x0000ff,\n\t\t\toutlineColor: 0xffffff,\n\t\t\toutlineWidth: 3\n\t\t});\n\t\trandom_location.addTo(my_data_layer);\n\t});\n});',
            '<div id="container">\n\t<button id="my_button">action</button>\n</div>',
            '#container {\n\ttext-align: center;\n}\n\n#my_button {\n\tborder: 1px solid red;\n\tmargin: 20px;\n}',
            'var my_data_layer = C.Layer();\nmy_data_layer.addTo(E.map);\n\nvar tileLayer;\n\nE.onload(function () {\n\n\tE.$(\'#my_button\').click(function () {\n\t\tif (tileLayer) {\n\t\t\tE.Map.remove(tileLayer);\n\t\t}\n\t\ttileLayer = C.TileLayer({\n\t\t\tsource: C.TMSSource({\n\t\t\t\turl: E.$(\'#container input\').val()\n\t\t\t}),\n\t\t\tschema: C.TileSchema.SphericalMercator\n\t\t});\n\t\tE.Map.add(tileLayer);\n\t});\n});',
            '{@include src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.css" /}\n<div id="container">\n\t<h4>Insert tilelayer link</h4>\n\t<div class="form-inline">\n\t\t<input type="text" class="form-control" value="http://a.tile.openstreetmap.org/{~lb}z{~rb}/{~lb}x{~rb}/{~lb}y{~rb}.png"/>\n\t\t<button class="btn btn-default" id="my_button">load</button>\n\t</div>\n</div>',
            '#container {\n\ttext-align: center;\n\twidth: 400px;\n}\n\n#container input {\n\twidth: 80%;\n\tmargin: 5px;\n}\n\n#container h4 {\n\tfont-family: \'Nexa-light\';\n}',
            'var my_data_layer = C.Layer();\nmy_data_layer.addTo(E.map);\n\nE.onload(function () {\n\n\tfunction addPoint(evt) {\n\t\tvar position = evt.getWorldPosition();\n\t\tvar new_pt = C.Circle({\n\t\t\tlocation: position,\n\t\t\tradius: 6,\n\t\t\tcolor: 0xffffff,\n\t\t\toutlineWidth: 2,\n\t\t\toutlineColor: 0x0000ff\n\t\t});\n\t\tnew_pt.addTo(my_data_layer);\n\t\tvar gpsCoord = C.CoordinatesHelper.TransformTo(position, C.ProjectionsHelper.WGS84);\n\t\tvar latitude = Math.round(gpsCoord.Y * 1000) / 1000;\n\t\tvar longitude = Math.round(gpsCoord.X * 1000) / 1000;\n\t\tE.$(\'#coord\').text(latitude + " " + longitude);\n\t}\n\n\tC.Events.on(\'mapClicked\', addPoint);\n\tE.ondestroy(function () {\n\t\tC.Events.off(\'mapClicked\', addPoint);\n\t});\n});',
            '<div id="container">\n\t<h4>Click on the map to add a point</h4>\n\t<div id="coord"></div>\n</div>',
            '#container {\n\ttext-align: center;\n\twidth: 400px;\n}\n\n#coord {\n\tmargin: 5px;\n}\n\n#container h4 {\n\tfont-family: "Nexa-light";\n}',
            'require(\'lib/citrongis.cluster.js\', function (err, Cluster) {\n\tif (err) { return console.log(\'Failed to load library.\'); }\n\tvar my_data_layer = new Cluster();\n\tmy_data_layer.addTo(E.map);\n\n\tE.onload(function () {\n\t\tvar bounds = C.Bounds(C.LatLng(-40, -40), C.LatLng(40,40));\n\t\tC.Events.zoomToBounds(bounds);\n\t\tE.$(\'#my_button\').click(function () {\n\t\t\tvar lat = Math.random() * 80 - 40;\n\t\t\tvar lon = Math.random() * 80 - 40;\n\n\t\t\tvar random_location = C.Circle({\n\t\t\t\tlocation: C.LatLng(lat, lon),\n\t\t\t\tradius: 10,\n\t\t\t\tcolor: 0x0000ff,\n\t\t\t\toutlineColor: 0xffffff,\n\t\t\t\toutlineWidth: 3\n\t\t\t});\n\t\t\trandom_location.addTo(my_data_layer);\n\t\t});\n\t});\n});',
            '<div id="container">\n\t<button id="my_button">action</button>\n</div>',
            '#container {\n\ttext-align: center;\n}\n\n#my_button {\n\tborder: 1px solid red;\n\tmargin: 20px;\n}'
        ];

        function createEditor(name, mode, snippet) {
            var editor = ace.edit(name);
            editor.$blockScrolling = Infinity;
            var Mode = ace.require(mode).Mode;
            editor.session.setMode(new Mode());
            editor.setTheme("ace/theme/tomorrow");
            editor.setOption("enableEmmet", true);
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            });
            var editor_history = E.Storage.get(name);
            if (editor_history == null) {
                editor_history = snippet;
                E.Storage.set(name, editor_history);
            }
            editor.setValue(editor_history);
            editor.clearSelection();
            var editor_timer;
            editor.on('change', function () {
                clearTimeout(editor_timer);
                editor_timer = setTimeout(function () {
                    E.Storage.set(name, editor.getValue());
                }, 5000);
            });
            editor.commands.addCommand({
                name: 'save',
                bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                exec: function(editor) {
                    E.Storage.set(name, editor.getValue());
                },
                readOnly: true
            });
            return editor;
        }

        E.onload(function () {

            var editor_code =       createEditor("editor_code",         "ace/mode/javascript",  snippets[0]);
            var editor_interface =  createEditor("editor_interface",    "ace/mode/html",        snippets[1]);
            var editor_style =      createEditor("editor_style",        "ace/mode/css",         snippets[2]);

            E.ondestroy(function () {
                E.Storage.set("editor_code",        editor_code.getValue());
                E.Storage.set("editor_interface",   editor_interface.getValue());
                E.Storage.set("editor_style",       editor_style.getValue());
            });

            E.$('.tabular.menu .item').tab({
                'onVisible': function (tabname) {
                    switch (tabname) {
                        case 'tab-name':
                            editor_code.resize(true);
                            editor_code.clearSelection();
                            break;
                        case 'tab-name2':
                            editor_interface.resize(true);
                            editor_interface.clearSelection();
                            break;
                        case 'tab-name3':
                            editor_style.resize(true);
                            editor_style.clearSelection();
                            break;
                    }
                }
            });

            E.$('.example button').click(function (evt) {
                var target = $(evt.currentTarget);
                var idx = parseInt($(target).attr('snippet-idx'));
                if (!isNaN(idx)) {
                    idx *= 3;
                    E.$('.tabular.menu .item').tab('change tab', 'tab-name');
                    editor_code.setValue(snippets[idx]);
                    editor_code.resize(true);
                    editor_code.clearSelection();
                    editor_interface.setValue(snippets[idx+1]);
                    editor_interface.resize(true);
                    editor_style.setValue(snippets[idx+2]);
                    editor_style.resize(true);

                }
            });

            var canRun = true;
            E.$('.launch_btn').click(function () {

                if (!canRun) { return; }
                canRun = false;
                ga('send', 'pageview', 'Editor/Run');
                if (extension) {
                    extension.destroy();
                }

                E.$('#card').addClass('flipped');
                C.Extension(new EditorHandler({
                    code: editor_code.getValue(),
                    tmpl: editor_interface.getValue(),
                    style: editor_style.getValue()
                }), function (err, ext) {
                    if (err) {
                        canRun = true;
                        E.$('#card .front').html('<i class="fa fa-play"></i> ERROR ' + err);
                        E.$('#card').removeClass('flipped');
                        return;
                    }
                    extension = ext;
                    extension.on('stopped', function () {
                        ga('send', 'pageview', 'Editor/RunnableStopped');
                    });
                    setTimeout(function () {
                        if (extension._module.ui._isLoaded) {
                            canRun = true;
                            E.$('#card .front').html('<i class="fa fa-play"></i> RUN');
                            E.$('#card').removeClass('flipped');
                        } else {
                            extension._module.ui.on('display', function () {
                                canRun = true;
                                E.$('#card .front').html('<i class="fa fa-play"></i> RUN');
                                E.$('#card').removeClass('flipped');
                            });
                        }
                    }, 1000);
                });
            });
        });
    });
}, {originalWindow:true});
