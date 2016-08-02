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
     * Listener for "enter" keypress on #reset*Password fields.
     */
    $("#resetNewPassword, #resetConfirmPassword").keypress(function(evt) {
        if (evt.which == 13 && !evt.shiftKey) {
            $("#resetButton").trigger("click");
        }
    });

    $("#loginButton").click(function() {
        /* This function handles submitting the change request */

        /* Split split up query arguments */
        var queryMap = {};
        if (location.search) {
            var pairs = location.search.substr(1).split("&");
            for (var i = pairs.length - 1; i >= 0; --i) {
                var pair = pairs[i].match(/^([^=]+)=(.+)$/);
                if (pair) {
                    queryMap[pair[1]] = pair[2];
                }
            }
        }

        if (!("id" in queryMap && "username" in queryMap)) {
            $("#resetError").text("You may not have followed a proper reset link to get here.");
            return;
        }

        if ($("#resetNewPassword").val() != $("#resetConfirmPassword").val()) {
            $("#resetError").text("Passwords do not match.");
            return;
        }

        $.ajax({
            "url": backendIpAddress + "password/change",
            "data": JSON.stringify({
                "username": queryMap["username"],
                "password": $("#resetNewPassword").val(),
                "token": queryMap["id"],
            }),
            "type": "POST",
        }).done(function(json) {
            localStorage.accessToken = json.token;
            window.location.href = "login.html";
        }).fail(function() {
            // Show error message
            $("#resetError").text("Error logging in.");
        });
    });
});