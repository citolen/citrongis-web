var self = this;
require('assets/mapicons/icons.json', function (err, picto_list) {
    self.picto_list = JSON.parse(picto_list);

    require(['lib/socket.io-1.3.7.js',
             'lib/semantic/semantic.js',
             'lib/jscolor.js'], function () {
        require(['manager.js',
                 'lib/citrongis.draw.js',
                 'lib/citrongis.editable.js'], function (err, mods) {
            var Manager = mods[0];
            var Drawer = mods[1];
            var Editable = mods[2];

            if (err) {
                console.error(err);
            }
            var layer = C.Layer();
            var clientOverlayLayer = C.Layer();
            clientOverlayLayer.addTo(E.map);
            layer.addTo(E.map);

            this.Editable = Editable;
            this.manager = Manager({
                layer: layer,
                clientOverlay: clientOverlayLayer
            });

            require(['models/Client.js',
                     'models/Feature.js'], function (err, models) {
                if (err) {
                    return console.error(err);
                }
                var Client = models[0];
                var Feature = models[1];
                var self = this;
                self.client;

                require(['routes/welcome.js',
                         'routes/viewport.js',
                         'routes/client.js',
                         'routes/featureadded.js',
                         'routes/featuredeleted.js',
                         'routes/featureupdated.js'], function (err, routes) {
                    if (err) {
                        return console.error(err);
                    }

                    function route() {
                        for (var i = 0; i < routes.length; ++i) {
                            routes[i].setup(self.client);
                        }
                    }

                    function get_hex_color(picker) {
                        return (parseInt(picker.toString(), 16));
                    }

                    function display_property(type) {
                        var color = false;
                        var outlinecolor = false;
                        var outlinewidth = false;
                        var width = false;
                        switch (type) {
                            case C.FeatureType.CIRCLE:
                                color = true;
                                outlinecolor = true;
                                outlinewidth = true;
                                break;
                            case C.FeatureType.LINE:
                                color = true;
                                width = true;
                                break;
                            case C.FeatureType.POLYGON:
                                color = true;
                                outlinecolor = true;
                                outlinewidth = true;
                                break;
                            default:
                        }
                        (color) ? E.$('#color_property').show() : E.$('#color_property').hide();
                        (outlinecolor) ? E.$('#outlinecolor_property').show() : E.$('#outlinecolor_property').hide();
                        (outlinewidth) ? E.$('#outlinewidth_property').show() : E.$('#outlinewidth_property').hide();
                        (width) ? E.$('#width_property').show() : E.$('#width_property').hide();
                    }

                    function toggle_buttons(type) {
                        (type == C.FeatureType.CIRCLE) ? (E.$('#draw_circle_btn').addClass('active')) : (E.$('#draw_circle_btn').removeClass('active'));
                        (type == C.FeatureType.LINE) ? (E.$('#draw_line_btn').addClass('active')) :   (E.$('#draw_line_btn').removeClass('active'));
                        (type == C.FeatureType.POLYGON) ? (E.$('#draw_poly_btn').addClass('active')) :   (E.$('#draw_poly_btn').removeClass('active'));
                    }

                    E.onload(function () {
                        var currentFeatureEditing;
                        var currentSelection;

                        E.$('.menu .item').suitab();
                        self.color_picker =         new jscolor(E.$('#select_color')[0]);
                        self.outlinecolor_picker =  new jscolor(E.$('#select_outlinecolor')[0]);
                        E.$('#select_color').change(function () {
                            var val = get_hex_color(self.color_picker);
                            Drawer.updateOptions({
                                color: val
                            });
                            if (currentFeatureEditing) {
                                if (currentFeatureEditing._feature._feature.color) {
                                    currentFeatureEditing._feature._feature.color(val);
                                }
                            }
                        });
                        E.$('#select_outlinecolor').change(function () {
                            var val = get_hex_color(self.outlinecolor_picker);
                            Drawer.updateOptions({
                                outlineColor: val
                            });
                            if (currentFeatureEditing) {
                                if (currentFeatureEditing._feature._feature.outlineColor) {
                                    currentFeatureEditing._feature._feature.outlineColor(val);
                                }
                            }
                        });
                        E.$('#select_outlinewidth').keyup(function () {
                            var val = parseInt(E.$('#select_outlinewidth').val());
                            Drawer.updateOptions({
                                outlineWidth: val
                            });
                            if (currentFeatureEditing) {
                                if (currentFeatureEditing._feature._feature.outlineWidth) {
                                    currentFeatureEditing._feature._feature.outlineWidth(val);
                                }
                            }
                        });
                        E.$('#select_width').keyup(function () {
                            var val = parseInt(E.$('#select_width').val());
                            Drawer.updateOptions({
                                width: val
                            });
                            if (currentFeatureEditing) {
                                if (currentFeatureEditing._feature._feature.width) {
                                    currentFeatureEditing._feature._feature.width(val);
                                }
                            }
                        });

                        self.manager.on('featureEdit', function (f) {
                            currentFeatureEditing = f;
                            display_property(f._feature._feature._type);
                            toggle_buttons(f._feature._feature._type);
                        });
                        self.manager.on('featureEditDone', function (f) {
                            currentFeatureEditing = undefined;
                            toggle_buttons();
                            display_property();
                        });

                        var socket;

                        function connect(map_name, map_pass) {
                            if (socket) {
                                socket.disconnect();
                            }
                            if (map_name != undefined && map_pass != undefined && map_name.length != 0) {
                                socket = io('http://192.168.0.16:5000/?map=' + map_name + '&map_credentials=' + map_pass);
                            } else {
                                socket = io('http://192.168.0.16:5000/');
                            }

                            socket.on('connect', function () {
                                self.client = Client({
                                    socket: socket
                                });
                                route();
                                E.$('.menu .item').suitab('change tab', 'tab-client');
                            });

                            socket.on('disconnect', function () {
                                self.manager.disconnect();
                            });
                        }
                        connect();

                        C.Viewport.on('moved', self.manager.sendViewport);

                        function abortEditting() {
                            if (currentFeatureEditing) {
                                currentFeatureEditing._feature.done();
                                currentFeatureEditing = undefined;
                            }
                        }

                        $('.display_viewport_btn').on('click', function (e) {
                            if (!$(this).find('i').hasClass('fa-check-square-o')) {
                                $(this).find('i').addClass('fa-check-square-o');
                                $(this).find('i').removeClass('fa-square-o');
                                clientOverlayLayer.addTo(E.map);
                                E.map.move(clientOverlayLayer, 0);
                            } else {
                                $(this).find('i').removeClass('fa-check-square-o');
                                $(this).find('i').addClass('fa-square-o');
                                E.map.remove(clientOverlayLayer);
                            }
                        });

                        function drawer_callback(feature) {
                            if (feature) {
                                var objFeature = Feature({
                                    id: self.manager.genId(),
                                    creator: self.client._id,
                                    feature: feature
                                });
                                self.manager.addFeature(objFeature);
                            }
                            toggle_buttons();
                            currentSelection = undefined;
                            display_property();
                        }

                        E.$('#draw_circle_btn').click(function () {
                            Drawer.abort();
                            abortEditting();
                            if (currentSelection == 0) {
                                currentSelection = undefined;
                                toggle_buttons();
                                display_property();
                                return;
                            }
                            currentSelection = 0;
                            display_property(C.FeatureType.CIRCLE);
                            toggle_buttons(C.FeatureType.CIRCLE);
                            Drawer.drawCircle({
                                color: get_hex_color(self.color_picker),
                                outlineColor: get_hex_color(self.outlinecolor_picker),
                                outlineWidth: parseInt(E.$('#select_outlinewidth').val())
                            }, drawer_callback);
                        });

                        E.$('#draw_line_btn').click(function () {
                            Drawer.abort();
                            abortEditting();
                            if (currentSelection == 1) {
                                currentSelection = undefined;
                                toggle_buttons();
                                display_property();
                                return;
                            }
                            currentSelection = 1;
                            display_property(C.FeatureType.LINE);
                            toggle_buttons(C.FeatureType.LINE);
                            Drawer.drawLine({
                                color: get_hex_color(self.color_picker),
                                width: parseInt(E.$('#select_width').val())
                            }, drawer_callback);
                        });

                        E.$('#draw_poly_btn').click(function () {
                            Drawer.abort();
                            abortEditting();
                            if (currentSelection == 2) {
                                currentSelection = undefined;
                                toggle_buttons();
                                display_property();
                                return;
                            }
                            currentSelection = 2;
                            display_property(C.FeatureType.POLYGON);
                            toggle_buttons(C.FeatureType.POLYGON);
                            Drawer.drawPolygon({
                                color: get_hex_color(self.color_picker),
                                outlineColor: get_hex_color(self.outlinecolor_picker),
                                outlineWidth: parseInt(E.$('#select_outlinewidth').val())
                            }, drawer_callback);
                        });

                        E.$('.picto_list img').click(function () {
                            var sel = $(this);
                            sel.addClass('selected');
                            var src = self.picto_list[parseInt($(this).attr('idx'))];
                            Drawer.abort();
                            abortEditting();
                            toggle_buttons();
                            currentSelection = undefined;
                            display_property();
                            Drawer.drawImage({
                                source: src,
                                width: 32,
                                height: 37,
                                anchorX: 0.5,
                                anchorY: 0.94
                            }, function (feature) {
                                sel.removeClass('selected');
                                if (!feature) {
                                    return;
                                }
                                var objFeature = Feature({
                                    id: self.manager.genId(),
                                    creator: self.client._id,
                                    feature: feature
                                });
                                self.manager.addFeature(objFeature);
                            });
                        });

                        E.$('#map_connect').click(function () {
                            var map_name = E.$('#map_name_input').val();
                            var map_pass = E.$('#map_pass_input').val();
                            connect(map_name, map_pass);
                        });

                        display_property();

                        E.ondestroy(function () {
                            C.Viewport.off('moved', self.manager.sendViewport);
                            socket.disconnect();
                        });
                    });
                    E.Display('ui/index.tmpl');
                });
            });
        });
    }, {windowScope: true});
});
