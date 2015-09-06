function is_open() {
    var menus = $(".menu-view");

    for (i = 0; i < menus.length; i++) {
        if ($(menus[i]).data("open") == "1") {
            return (true);
        }
    }
    return (false);
}


function open_menu(module) {


    var open = $("#" + module).data("open");
    if (!is_open() && (open == undefined || open == "0")) {
        $("#left-menu").removeClass("s1 m1 l1"); 
        $("#left-menu").addClass("s1 m1 l1");

        $("#citrongis-side").removeClass("s11 m11 l11"); 
        $("#citrongis-side").addClass("s6 m6 l6");

        $("#" + module).removeClass("hide");
        $("#" + module).data("open", "1");
    }
    else if (open == "1") {
        $("#left-menu").removeClass("s6 m6 l6"); 
        $("#left-menu").addClass("s1 m1 l1");

        $("#citrongis-side").removeClass("s6 m6 l6"); 
        $("#citrongis-side").addClass("s11 m11 l11");                

        $("#" + module).addClass("hide");
        $("#" + module).data("open", "0");
    }
}

$("#user-menu").click(function() {
    open_menu("user");
});

$("#store-menu").click(function() {
    open_menu("store");
});

$("#search-menu").click(function() {
    open_menu("search");
});
$("#settings-menu").click(function() {
    open_menu("settings");
});
$("#applications-menu").click(function() {
    open_menu("applications");
});
