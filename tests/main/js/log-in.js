
$("#sign-in").click(function(){    
    $.ajax({
        url:"http://52.10.137.45:8080/auth/login",
        data:{
            "username": "romain.gabilan@epitech.eu",
            "password": "Romain31",
            "grant_type": "password",
            "client_id": "key",
            "client_secret": "secret"
        },
        type:"POST",
        crossDomain: true,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        },
        success: function(result, status, xhr){
            alert(result);
            alert(status);
            alert(xhr);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
      }
    });
});