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

$("#sign-up").click(function() {
    $("#sign-in-view").addClass("hide");
    $("#sign-up-view").removeClass("hide");
});

  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });