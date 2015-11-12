require('lib/citrongis.cluster.js', function (err, Cluster) {

    var my_data_layer = new Cluster();
    my_data_layer.addTo(E.map);

    var logInterval;
    var access_token;

    E.onload(function () {

        function login_success() {
            display_ui();
            load_user_feed('self', null, function () {
                $('#me_btn').html('<i class="fa fa-eye"></i> me');
            });
        }

        function display_ui() {
            if (access_token) {
                E.$('#logout_btn').show();
                E.$('#welcome').hide();
                E.$('#me_btn').show();
                E.$('#auth_features').show();
            } else {
                E.$('#logout_btn').hide();
                E.$('#welcome').show();
                E.$('#me_btn').hide();
                E.$('.results').empty();
                E.$('#auth_features').hide();
            }
        }

        function load_user_feed(id, elem, callback) {
            my_data_layer.clearLayer();
            var url = 'https://api.instagram.com/v1/users/' + id + '/media/recent?count=100&access_token=' + access_token;
            var count = 0;
            var refresh = 0;
            var it = function (url) {
                ++refresh;
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: function (instaRes) {
                        var medias = instaRes.data;
                        if (medias) {
                            for (var i = 0; i < medias.length; ++i) {
                                var media = medias[i];
                                if (!media.location) { continue; }
                                var pic = C.Circle({
                                    location: C.LatLng(media.location.latitude, media.location.longitude),
                                    radius: 10,
                                    color: 0x4E7BA0,
                                    outlineColor: 0xffffff,
                                    outlineWidth: 4
                                });
                                pic.addTo(my_data_layer);
                                var popup = C.Popup(pic, {
                                    content: '<a class="shadow"><img class="popup-pic" src="' + media.images.standard_resolution.url + '" width="300" /></a><br/><span class="popup-caption">' + ((media.caption && media.caption.text) ? (media.caption.text):('')) + '</span><span class="popup-location">' + media.location.name + '</span>'
                                });
                                pic.bindPopup(popup);
                                ++count;
                            }
                        } else {
                            if (elem) {
                                $('button', elem).html('<i class="fa fa-exclamation-circle"></i>');
                            }
                            return;
                        }

                        if (medias && refresh < 6 && count < 100 && instaRes.pagination && instaRes.pagination.next_url) {
                            it (instaRes.pagination.next_url);
                        } else {
                            C.Events.zoomToBounds(my_data_layer.getBounds());
                            if (elem) {
                                if (count == 0) {
                                    $('button', elem).html('<i class="fa fa-frown-o"></i>');
                                } else {
                                    $('button', elem).html('<i class="fa fa-eye"></i>');
                                }
                            }
                            if (callback) {
                                callback();
                            }
                        }
                    }
                });
            };
            it (url);
        }

        function search() {
            if (!access_token) { return; }

            E.$('.loading').show();
            var query = E.$('#search_input').val();

            $.ajax({
                url: 'https://api.instagram.com/v1/users/search?q=' + query + '&count=5&access_token=' + access_token,
                dataType: "jsonp",
                success: function (instaRes) {
                    E.$('.loading').hide();
                    E.$('.results').empty();
                    var search_result = instaRes.data;
                    for (var i = 0; i < search_result.length; ++i) {
                        var result = search_result[i];
                        var template = '<div class="result">\
<img class="image" src="' + result.profile_picture + '" />\
<span class="instaname">' + result.username + '</span>\
<span class="fullname">' + result.full_name + '</span>\
<button class="btn view"><i class="fa fa-eye"></i></button>\
</div>';
                        var elem = $.parseHTML(template);
                        $('button', elem).click(function (id, elem) {
                            $('button', elem).html('<i class="fa fa-refresh fa-spin"></i>');
                            load_user_feed(id, elem);

                        }.bind(null, result.id, elem));
                        E.$('.results').append(elem);
                    }
                }
            });
        }

        E.$('#search_input').keyup(function(event){
            if(event.keyCode == 13){
                search();
            }
        });

        E.$('#me_btn').click(function () {
            $('#me_btn').html('<i class="fa fa-refresh fa-spin"></i>');
            login_success();
        });

        E.$('#search_btn').click(search);

        E.$('#logout_btn').click(function () {
            access_token = undefined;
            my_data_layer.clearLayer();
            window.open('https://instagram.com/accounts/logout/');
            display_ui();
        });
        E.$('#login_btn').click(function () {
            my_data_layer.clearLayer();
            //build
            //            var loginWindow = window.open('https://instagram.com/oauth/authorize/?client_id=7732ed3cac8b43c3a5de5f9ac8011860&redirect_uri=http://eip.epitech.eu/2016/citrongis/&response_type=token',
            //                                          "", "width=400, height=250");
            //local test
            var loginWindow = window.open('https://instagram.com/oauth/authorize/?client_id=7732ed3cac8b43c3a5de5f9ac8011860&redirect_uri=http://localhost:8080/&response_type=token',
                                          "", "width=400, height=250");

            var strLocation;
            var strHash;

            var fnCheckLocation = function(){
                try {
                    if (strLocation != loginWindow.location.href) {
                        strLocation = loginWindow.location.href;
                        strHash = loginWindow.location.hash;
                        var idx;
                        if ((idx=strHash.indexOf('access_token')) != -1) {
                            access_token = strHash.substr(idx+13);
                            loginWindow.close();
                            clearInterval(logInterval);
                            login_success();
                        }
                    }
                } catch (e) {
                }
            };
            logInterval = setInterval( fnCheckLocation, 100 );
        });
        display_ui();
        E.ondestroy(function () {
            clearInterval(logInterval);
        });
    });
});

E.Display('ui/index.tmpl');
