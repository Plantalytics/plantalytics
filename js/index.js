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
            "url": backendIpAddress + "login",
            "data": JSON.stringify({
                "username": $('#loginUsername').val(),
                "password": $('#loginPassword').val()
            }),
            "type": "POST"
        }).done(function(json) {
            if (json.auth_token) {
                localStorage.accessToken = json.auth_token;
                window.location.href = "dashboard.html";
            } else {
              var responseObject = JSON.parse(json.responseText);
              if (responseObject && responseObject.errors) {
                var errors = responseObject.errors;
                for (var errorCode in errors) {
                $("#loginError").text(errors[errorCode]);
                }
              } else {
                $("loginError").text("An unknown error occured. Please try again.");
            }
        }).fail(function(json) {
            var responseObject = JSON.parse(json.responseText);
            if (responseObject && responseObject.errors) {
              var errors = responseObject.errors;
              for (var errorCode in errors) {
                $("#loginError").text(errors[errorCode]);
              }
            } else {
                $("loginError").text("An unknown error occured. Please try again.");
        });
    });
});
