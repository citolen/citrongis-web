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
            }, function(result, status, xhr){
                console.log(result);
            });
    }
});


$("#sign-up-send").click(function() {
    username = $("#email-sign-up").val();
    password = $("#password-sign-up").val();

    console.log(username);
    if (username != "" && password != "") {
        alert("aaa");
        $.post("http://52.10.137.45:8080/auth/subscribe",
        {
           email: username,
           password: password
        }, function(result, status, xhr){
            console.log(result);
        });
    }
});

$("#sign-up").click(function() {
    $("#sign-in-view").addClass("hide");
    $("#sign-up-view").removeClass("hide");
});

$(document).ready(function(){
    $('.modal-trigger').leanModal();
});