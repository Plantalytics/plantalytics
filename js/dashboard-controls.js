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

    $("#menu-logout").click(function() {
        // Delete access token from local storage.
        delete localStorage.accessToken;

        // Redirect to login page
        window.location = "index.html";
    });

    // Listener for "Change Password" button.
    $("#menu-change-password").click(function() {
        // Close menu button
        $("#menu").click();

        // Listener for 'enter' keypress on password fields.
        $('#current-password, #new-password').keypress(function(evt) {
            if (evt.which == 13 && !evt.shiftKey) {
                $('#change-password-button').trigger('click');
            }
        });

        // Set up click listener for password button
        $("#change-password-button").click(function() {
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

            // Get old and new password.
            var oldPassword = $("#current-password").val();
            var newPassword = $("#new-password").val();

            // Make sure the user didn't hit cancel on either prompt.
            if (oldPassword != null &&
                    newPassword != null) {
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
                    $("#current-password").val("");
                    $("#new-password").val("");

                    // Close dialog
                    $("#dialog-change-password").dialog("close");

                    // Let user know of success!
                    $("#change-password-result").val("Password changed successfully!");
                    $("#dialog-change-password-result").dialog("open");
                }).fail(function(json) {
                    // Enable change password button while making ajax call
                    $("#change-password-button").prop("disabled", false);

                    // Clear fields
                    $("#current-password").val("");
                    $("#new-password").val("");

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
                        // Show generic error
                        alert("An unknown error occurred. Please logout and log back in, then try again.");
                    }

                    // Make sure we have an error to display
                    if (errorToDisplay) {
                        // Set error text
                        $("#change-password-result-text").val(errorToDisplay);
                    }

                    // Show dialog
                    $("#dialog-change-password-result").dialog("open");
                });
            }
        });

        // Show change password dialog
        $("#dialog-change-password").dialog({
          "show": {
            "effect": "scale",
            "duration": 400
          },
          "hide": {
            "effect": "scale",
            "duration": 400
          }
        });
    });
});

function makeGetEnvData(env_variable) {
    return function () {
        $.ajax({
            "url": backendIpAddress + "env_data",
            "data": JSON.stringify({
              "vineyard_id": 1,
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
