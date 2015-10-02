/*
*  utilsLogin.js    //TODO description
*/

var Utils = Utils || {};

Utils.set_if_not_empty = function (selector, data) {
    if (data) {
        $(selector).text(data);
    }
};

Utils.get_cookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
    }
    return "";
};

Utils.getVisible = function (data) {
    var save;

    for (var key in data) {
        if ((data[key]._css['display']) != 'none') {
            save = key;
        }
    }
    return (save);
}

Utils.check_log_in = function() {
    var status = "";
    var access_token = Utils.get_cookie("citrongis_access_token");
    var refresh_token = Utils.get_cookie("citrongis_refresh_token");

    if (access_token == "") {
        status = "no-login";
    }
    else {
        $.ajax({
            async: false,
            url: "http://52.10.137.45:8080/account/get",
            method: "GET",
            headers : {
                Authorization: "Bearer " + access_token
            },
            success: function (data) {
                status = "login";
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Mauvais token");
                status = "no-login";

                $.ajax({
                    async: false,
                    type: 'POST',
                    url: "http://52.10.137.45:8080/auth/login",
                    data: {
                        "grant_type": "refresh_token",
                        "client_id": "key",
                        "client_secret": "secret",
                        "refresh_token": refresh_token
                    },
                    success: function(result) {
                        document.cookie="citrongis_access_token=" + result.access_token + "; expires=Thu, 30 Dec 2016 12:00:00 UTC";
                        document.cookie="citrongis_refresh_token=" + result.refresh_token + "; expires=Thu, 30 Dec 2016 12:00:00 UTC";
                        status = "login";
                        console.log("Nouveau refresh token");
                    },
                    error: function(xhr, textStatus, errorThrown){
                        status = "no-login";
                        console.log("mauvais refresh token, GO LOGIN");
                    }
                });
            }
        });
    }
    return (status);
}
