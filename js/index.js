/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

$(function() {
    /*
     * Listener for 'enter' keypress on #login* field.
     */
    $("#loginUsername, #loginPassword").keypress(function(evt) {
        if (evt.which == 13 && !evt.shiftKey) {
            $("#loginButton").trigger("click");
        }
    });

    $("#loginButton").click(function() {
        /* This function handles user login */
        $.ajax({
            "url": backendIpAddress + "login",
            "data": JSON.stringify({
                "username": $("#loginUsername").val(),
                "password": $("#loginPassword").val()
            }),
            "type": "POST"
        }).done(function(json) {
            if (json.auth_token) {
                localStorage.accessToken = json.auth_token;
                window.location.href = "dashboard.html";
            } else {
                // Show error message.
                $("#loginError").text("Error logging in.");
            }
        }).fail(function() {
            // Show error message
            $("#loginError").text("Error logging in.");
        });
    });
});
