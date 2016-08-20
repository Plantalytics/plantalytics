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
            $('.submit:visible').trigger('click');
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
            if (json.auth_token &&
                    json.authorized_vineyards) {
                localStorage.accessToken = json.auth_token;
                localStorage.authorizedVineyards = JSON.stringify(json.authorized_vineyards);

                // TODO: Don't have this be 0 by default?
                localStorage.selectedVineyard = JSON.stringify(json.authorized_vineyards[0].vineyard_id);

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

    $('#forgotPassword').click(function() {
        /* If the username is already entered we can just submit. */
        if ($("#loginUsername").val()) {
            $("#resetButton").click();
        } else {
            /* Hide loginItems and show resetItems. */
            $("#loginError").text("");
            $(".loginItem").hide();
            $(".resetItem").show();
        }
    });

    $('#resetButton').click(function() {
        /* Submit password reset request. */
        $(this).prop("disabled", true);
        $.ajax({
            "url": backendIpAddress + "password/reset",
            "data": JSON.stringify({
                "username": $('#loginUsername').val(),
            }),
            "type": "POST",
        }).done(function(json) {
            json = json || {};
            if ("errors" in json && json.errors.length) {
                // TODO: Integrate with error system.
                $("#loginError").text("Error requesting password.");
            } else {
                $("#loginError").empty().append(
                    $("<span>").addClass("success")
                    .text("Password reset request successful, check your email!")
                );
                revertToLogin();
            }
        }).fail(function() {
            // Show error message
            revertToLogin();
            $("#loginError").text("Error requesting password.");
        });
    });
});

function revertToLogin() {
    $(".resetItem").hide();
    $(".loginItem").show();
    $("#resetButton").prop("disabled", false);
}
