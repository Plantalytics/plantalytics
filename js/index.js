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
     * Listener for 'enter' keypress on #loginUsername field.
     */
    $('#loginUsername').on('keypress', function(evt) {
        if (evt.which == 13 && !evt.shiftKey) {
            $('#loginButton').trigger('click');
        }
    });

    /*
     * Listener for 'enter' keypress on #loginPassword field.
     */
    $('#loginPassword').on('keypress', function(evt) {
        if (evt.which == 13 && !evt.shiftKey) {
            $('#loginButton').trigger('click');
        }
    });

    $('#loginButton').click(function() {
        /* This function to handle user login
         * once backend support allows
         */
        $.ajax({
            url: backendIpAddress + 'login?username=' + $('#loginUsername').val()
                    + '&password=' + $('#loginPassword').val(),
            type: "GET"
        }).done(function(json) {
            if (json.token) {
                localStorage.accessToken = json.token;
                window.location.href = "dashboard.html";
            } else {
                // Show error message.
                $("#loginError").text("Error logging in.");
            }
        }).error( function() {
            // Show error message
            $("#loginError").text("Error logging in.");
        });
    });
});
