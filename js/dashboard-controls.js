/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

/////////////////////////////////// Controls ///////////////////////////////////

$(function() {
    $("#menu").click(function() {
        var $menu = $(".menu");
        var visible = $menu.is(":visible");
        $menu.show();
        var width = $menu.width();
        var height = $menu.height();
        if (!$menu.is(':animated')) {
            if (visible) {
                // Animate hiding menu.
                $menu.animate({
                    "height": 10,
                }, {
                    "duration": 150,
                }).animate({
                    "width": 0,
                }, {
                    "duration": 300,
                    "queue": true,
                    "complete": function() {
                        $menu.width(width);
                        $menu.height(height);
                        $menu.hide();
                    }
                });
            } else {
                // Animate showing menu.
                $menu.width(0).height(10);
                $menu.animate({
                    "width": width,
                }, {
                    "duration": 150,
                }).animate({
                    "height": height,
                }, {
                    "duration": 300,
                    "queue": true
                });
            }
        }
    });

    $(".data-view-defaults .data-button-label div").click(function(e) {
        var parent = $(this).parent();
        var selector = "." + parent.attr("class").replace(/ /g, ".");
        if (localStorage.defaultDataView == selector) {
            // Double tap to turn off.
            delete localStorage.defaultDataView;
            setTimeout(function() {
                parent.find("input").prop("checked", false);
            }, 10);
        } else {
            // Set new default.
            localStorage.defaultDataView = selector;
        }
    });

    $('#leafwetness-button').click(makeGetEnvData("leafwetness"));

    $('#temperature-button').click(makeGetEnvData("temperature"));

    $('#humidity-button').click(makeGetEnvData("humidity"));

    // Listener for "Change Password" button.
    $("#menu-change-password").click(function() {
        // Close menu button
        $("#menu").click();

        // Show change password dialog
        $("#dialog-change-password").dialog({
          "show": {
            "effect": "scale",
            "duration": 400
          },
          "hide": {
            "effect": "scale",
            "duration": 400
          },
          "close": function() {
              // Clear fields
              clearChangePasswordFields();
          }
        });
    });

    // Listener for 'enter' keypress on password fields.
    $('#current-password, #new-password, #new-password-confirm').keypress(function(evt) {
        if (evt.which == 13 && !evt.shiftKey) {
            $('#change-password-button').trigger('click');
        }
    });

    // Set up result dialog
    $("#dialog-change-password-result").dialog({
        "autoOpen": false,
        "show": {
          "effect": "scale",
          "duration": 400
        },
        "hide": {
          "effect": "scale",
          "duration": 400
        }
    });

    // Set up click listener for change password button
    $("#change-password-button").click(function() {
        // Get old and new password.
        var oldPassword = $("#current-password").val();
        var newPassword = $("#new-password").val();
        var newPasswordConfirm = $("#new-password-confirm").val();

        // Make sure that confirm is same as new password
        if (newPassword != newPasswordConfirm) {
            // Show error and bail
            showPasswordChangeResult("New passwords don't match.", false);
            return;
        }

        // Make sure the user filled out all information.
        if (oldPassword != null &&
                newPassword != null &&
                newPasswordConfirm != null) {
            // Disable change password button while making ajax call
            $("#change-password-button").prop("disabled", true);

            // Call change password endpoint with entered data.
            $.ajax({
                "url": backendIpAddress + "password/change",
                "data": JSON.stringify({
                  "old": oldPassword,
                  "password": newPassword,
                  "auth_token": localStorage.accessToken
                }),
                "type": "POST",
            }).done(function(json) {
                // Enable change password button while making ajax call
                $("#change-password-button").prop("disabled", false);

                // Clear fields
                clearChangePasswordFields();

                // Show result
                showPasswordChangeResult("Password changed successfully!", true);
            }).fail(function(json) {
                // Enable change password button while making ajax call
                $("#change-password-button").prop("disabled", false);

                // Show error if returned
                var errorToDisplay;

                // Parse response
                var responseObject = JSON.parse(json.responseText);
                if (responseObject &&
                        responseObject.errors) {
                    var errors = responseObject.errors;
                    for (var errorCode in errors) {
                        // Save to variable
                        errorToDisplay = errors[errorCode];

                        // Only save first error
                        break;
                    }
                } else {
                    // Show generic error and close dialog
                    showPasswordChangeResult("An unknown error occurred. Please logout and log back in, then try again.", true);
                }

                // Show error without closing dialog
                showPasswordChangeResult(errorToDisplay, false);
            });
        }
    });

    $("#menu-logout").click(function() {
        // Delete access token from local storage.
        delete localStorage.accessToken;

        // Delete authorized vineyards and selected vineyard
        delete localStorage.authorizedVineyards;
        delete localStorage.selectedVineyard;

        // Redirect to login page
        window.location = "index.html";
    });
});

function clearChangePasswordFields() {
    // Clear all fields
    $("#current-password").val("");
    $("#new-password").val("");
    $("#new-password-confirm").val("");
}

function showPasswordChangeResult(resultText, shouldClose) {
    // Close dialog if requested
    if (shouldClose) {
        $("#dialog-change-password").dialog("close");
    }

    // Show result text and open result dialog
    $("#change-password-result-text").text(resultText);
    $("#dialog-change-password-result").dialog("open");
}

function makeGetEnvData(env_variable) {
    return function () {
        $.ajax({
            "url": backendIpAddress + "env_data",
            "data": JSON.stringify({
              "vineyard_id": localStorage.selectedVineyard,
              "env_variable": env_variable,
              "auth_token": localStorage.accessToken
            }),
            "dataType": "json",
            "type": "POST",
        }).done(function(json) {
            if (json.env_data) {
                var envData = parseEnvData(json.env_data, env_variable);
                map.removeLayer(idw);
                idw = L.idwLayer(envData, idwOptions).addTo(map);
            } else {
                /* TODO: add error handing message*/
            }
        }).fail(function() {
            /* TODO: add error handing message*/
        });
    }
}

function parseEnvData(envData, envDataType) {
    var parsedData = [];
    for (var i = 0; i < envData.length; ++i) {
        var envDataItem = [];
        envDataItem[0] = envData[i].latitude;
        envDataItem[1] = envData[i].longitude;
        switch (envDataType) {
          case "leafwetness":
            envDataItem[2] = envData[i].leafwetness;
            break;
          case "temperature":
            envDataItem[2] = envData[i].temperature;
            break;
          case "humidity":
            envDataItem[2] = envData[i].humidity;
        }

        parsedData[i] = envDataItem;
    }

    return parsedData;
}
