/* Send sign-in form */
$("#sign-in-send").click(function(){
    username = $("#email").val();
    password = $("#password").val();
    
    if (username != "" && password != "") {
        $.post("http://52.10.137.45:8080/auth/login/",
            {
               username: username,
               password: password,
               grant_type: "password",
               client_id: "key",
               client_secret: "secret"
            })
            .done(function(result){
                console.log(result.access_token);
                document.cookie="citrongis_access_token=" + result.access_token + "; expires=Thu, 30 Dec 2016 12:00:00 UTC";
                document.cookie="citrongis_refresh_token=" + result.refresh_token + "; expires=Thu, 30 Dec 2016 12:00:00 UTC";
            })
            .fail(function(xhr, textStatus, errorThrown){
                error = JSON.parse(xhr.responseText).error;
                
                if(error == "invalid_grant") {
                    Materialize.toast('Invalid Email or Password', 4000,'');
                }
            });
    }
});

/* Send sign-up form */
$("#sign-up-send").click(function() {
    username = $("#email-sign-up").val();
    password = $("#password-sign-up").val();
        
    if (username != "" && password != "") {
        if ($("#email-sign-up").hasClass("invalid")) {
            Materialize.toast("Invalid email", 4000, '');
        }
        else if ($("#cg-checkbox").is(':checked') == false) {
            Materialize.toast("Accept the general conditions", 4000, '');
        }
        else {
            $.post("http://52.10.137.45:8080/auth/subscribe",
            {
               email: username,
               password: password
            })
            .done(function(result){
                /* reset all form */
                $("#email-sign-up").val("").removeClass("validate valid");
                $("#label-email-sign-up").removeClass("active");
                $("#password-sign-up").val("").removeClass("validate valid");
                $("#label-password-sign-up").removeClass("active");
                $("#cg-checkbox").removeAttr("checked");
                
                
                $("#create-account-success").removeClass("hide");
                setTimeout(function () {$("#create-account-success").fadeToggle('slow', function (){$("#create-account-success").addClass("hide");})},4000)

                $("#sign-in-view").removeClass("hide");
                $("#sign-up-view").addClass("hide");
            })
            .fail(function(xhr, textStatus, errorThrown) {
                code = JSON.parse(xhr.responseText).code;

                if (code == "3" ) {
                    Materialize.toast("Password is too short", 4000, '');
                }
                else if (code == "4") {
                    Materialize.toast("Sorry, the email is already used", 4000, '');
                }
            });
        }
    }
    else {
        Materialize.toast("Enter email and password", 4000, '');
    }
});
   
$("#forget-password-send").click(function() {
    email = $("#email-forget-password").val();

    if (email != "") {
        if ($("#email-forget-password").hasClass("invalid")) {
            $("#invalid-email-forget-password").removeClass("hide");
            setTimeout(function () {$("#invalid-email-forget-password").fadeToggle('slow', function (){$("#invalid-email-forget-password").addClass("hide");})},4000);
        }
        else {
            $.post("http://52.10.137.45:8080/auth/forgetPassword/",
            {
               email: email
            })
            .done(function(result) {
                console.log(result);
                //TO DO
            })
            .fail(function(xhr, textStatus, errorThrown) {
                code = JSON.parse(xhr.responseText).code;
                
                console.log(xhr);
                if (code == "6") {
                    $("#not-found-email-forget-password").removeClass("hide");
                    setTimeout(function () {$("#not-found-email-forget-password").fadeToggle('slow', function (){$("#not-found-email-forget-password").addClass("hide");})},4000);
                }
            });
        }
    }
    else {
        $("#no-email-forget-password").removeClass("hide");
        setTimeout(function () {$("#no-email-forget-password").fadeToggle('slow', function (){$("#no-email-forget-password").addClass("hide");})},4000);
    }
});

$("#sign-up").click(function() {
    $("#sign-in-view").addClass("hide");
    $("#sign-up-view").removeClass("hide");
});

$("#back-to-sign-in").click(function() {
    $("#sign-in-view").removeClass("hide");
    $("#sign-up-view").addClass("hide");    
});

$(document).ready(function(){
    $('.modal-trigger').leanModal();
});