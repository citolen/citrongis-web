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
            'var my_data_layer = C.Layer();\nmy_data_layer.addTo(E.map);\n\nE.onload(function () {\n\tE.$(\'#my_button\').click(function () {\n\t\tvar lat = Math.random() * 80 - 40;\n\t\tvar lon = Math.random() * 80 - 40;\n\n\t\tvar random_location = C.Circle({\n\t\t\tlocation: C.LatLng(lat, lon),\n\t\t\tradius: 10,\n\t\t\tcolor: 0x0000ff,\n\t\t\toutlineColor: 0xffffff,\n\t\t\toutlineWidth: 3\n\t\t});\n\t\trandom_location.addTo(my_data_layer);\n\t});\n});',
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

            E.$('.tabular.menu .item').tab();

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
                    extension = ext;
                    extension.on('stopped', function () {
                        ga('send', 'pageview', 'Editor/RunnableStopped');
                    });
                    setTimeout(function () {
                        if (extension._module.ui._isLoaded) {
                            canRun = true;
                            E.$('#card').removeClass('flipped');
                        } else {
                            extension._module.ui.on('display', function () {
                                canRun = true;
                                E.$('#card').removeClass('flipped');
                            });
                        }
                    }, 1000);
                });
            });
        });
    });
}, {originalWindow:true});
