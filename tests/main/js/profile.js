function set_if_not_empty(selector, data) {
    if (data) {
        $(selector).text(data);
    }
}

$(document).ready(function() {
    access_token = get_cookie("citrongis_access_token");
    
    // Load modal
    $('.modal-trigger').leanModal();
    $.ajax({
        url: "http://52.10.137.45:8080/account/get",
        method: "GET",
        headers : {
            Authorization: "Bearer " + access_token
        },
        success: function (res) {
            data = res.data;
            
            /* Get profile informations */
            set_if_not_empty("#firstname", data.firstname);
            set_if_not_empty("#lastname", data.lastname);
            set_if_not_empty("#username", data.username);
            set_if_not_empty("#email", data.email);
            set_if_not_empty("#profile-type", data.profileType );
            set_if_not_empty("#language", data.language);
            set_if_not_empty("#location", data.location);
            set_if_not_empty("#phone-number", data.phoneNumber);
            set_if_not_empty("#date-of-birth", data.dateOfBirth);
            set_if_not_empty("#company", data.companyName);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log("Bad token");
            console.log(xhr.resoponseText);
        }
    });
});

function set_modal_input(selector) {
    data = $("#" + selector).text();
    
    if (data != "-") {
        $("#" + selector + "-edit").val(data);
        $("#label-" + selector + "-edit").addClass("active");
    }
}

$("#open-edit-profile-modal").click(function() {

    set_modal_input("firstname");
    set_modal_input("lastname");
    set_modal_input("username");
    set_modal_input("email");
    set_modal_input("profile-type");
    set_modal_input("language");
    set_modal_input("location");
    set_modal_input("phone-number");
    set_modal_input("date-of-birth");
    set_modal_input("company");
    console.log($("#firstname").text());

});
