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

    $('#leafwetness-button').click(function() {
        $.ajax({
            url: backendIpAddress + 'env_data',
            data: {
              vineyard_id: 1,
              env_variable: 'leafwetness'
            },
            dataType: 'json',
            type: "GET"
        }).done(function(json) {
            if (json.env_data) {
                var envData = parseEnvData(json.env_data, 'lw');
                map.removeLayer(idw);
                idw = L.idwLayer(envData, idwOptions).addTo(map);
            } else {
                window.location.href = "dashboard.html";
                /* TODO: add error handing message*/
            }
        }).fail(function() {
            window.location.href = "dashboard.html";
            /* TODO: add error handing message*/
        });
    });

    $('#temperature-button').click(function() {
        $.ajax({
            url: backendIpAddress + 'env_data',
            data: {
              vineyard_id: 1,
              env_variable: 'temperature'
            },
            dataType: 'json',
            type: "GET"
        }).done(function(json) {
            if (json.env_data) {
                var envData = parseEnvData(json.env_data, 'tmp');
                map.removeLayer(idw);
                idw = L.idwLayer(envData, idwOptions).addTo(map);
            } else {
                window.location.href = "dashboard.html";
                /* TODO: add error handing message*/
            }
        }).fail(function() {
            window.location.href = "dashboard.html";
            /* TODO: add error handing message*/
        });
    });

    $('#humidity-button').click(function() {
        $.ajax({
            url: backendIpAddress + 'env_data',
            data: {
              vineyard_id: 1,
              env_variable: 'humidity'
            },
            dataType: 'json',
            type: "GET"
        }).done(function(json) {
            if (json.env_data) {
                var envData = parseEnvData(json.env_data, 'hum');
                map.removeLayer(idw);
                idw = L.idwLayer(envData, idwOptions).addTo(map);
            } else {
                window.location.href = "dashboard.html";
                /* TODO: add error handing message*/
            }
        }).fail(function() {
            window.location.href = "dashboard.html";
            /* TODO: add error handing message*/
        });
    });

    $("#menu-logout").click(function() {
        // Delete access token from local storage.
        delete localStorage.accessToken;

        // Redirect to login page
        window.location = "index.html";
    });
});

function parseEnvData(envData, envDataType) {
    var parsedData = [];
    for (var i = 0; i < envData.length; ++i) {
        var envDataItem = [];
        envDataItem[0] = envData[i].latitude;
        envDataItem[1] = envData[i].longitude;
        switch (envDataType) {
          case 'lw':
            envDataItem[2] = envData[i].leafwetness;
            break;
          case 'tmp':
            envDataItem[2] = envData[i].temperature;
            break;
          case 'hum':
            envDataItem[2] = envData[i].humidity;
        }

        parsedData[i] = envDataItem;
    }

    return parsedData;
}
