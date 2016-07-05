/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

$.getScript('http://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=' + mapQuestKey, readyMap);

/////////////////////////////////// On Load ///////////////////////////////////
$(function() {
    // Get information for our current user.
    // TODO: $.ajax({...})

    // Make sure the user has a login token before continuing.
    if (!localStorage.accessToken) {
      window.location = "login.html";
    }

    ({
        "url": "",
        "dataType": "json",
        "success": function (data) {
            if (mapsReady) {
                createMap(data);
            } else {
                delayMapCreation(data);
            }
        },
    }).success({
        // Vineyard center [lat, lon]
        "center": {
            "lat": 45.281041,
            "lng": -123.061896
        },
        // Node locations & values [lat, lon, val], ...
        'nodeLoc': [
            [45.281679, -123.062533, 58],
            [45.281554, -123.061838, 17],
            [45.281423, -123.061124, 55],
            [45.281249, -123.062615, 25],
            [45.281123, -123.061897, 42],
            [45.280989, -123.061145, 51],
            [45.280800, -123.062877, 17],
            [45.280680, -123.062076, 21],
            [45.280511, -123.061333, 66]
        ],
        // Boundary coords [lat, lon], ...
        // Must be listed in drawing order
        'propertyBoundary': [
            [45.282053, -123.062833],
            [45.281605, -123.060469],
            [45.280016, -123.061092],
            [45.280269, -123.061468],
            [45.280390, -123.062234],
            [45.280377, -123.063102],
            [45.280464, -123.063369]
        ]
    });
});

////////////////////////////////// Map code ///////////////////////////////////
var map, mapsReady = false, mapsData = null;
function createMap(data) {
    // Calculate map bounds
    var latOffset = .00145; // Perhaps calculate these offsets based
    var lngOffset = .00525; //   on the surface area of the vineyard.
    var southWest = {'lat': data.center.lat - latOffset, 'lng': data.center.lng - lngOffset};
    var northEast = {'lat': data.center.lat + latOffset, 'lng': data.center.lng + lngOffset};

    // Initialize map
    mapsData = data;
    map = L.map('map', {
        center: data.center,
        doubleClickZoom: false,
        layers: MQ.satelliteLayer(),
        maxBounds: [southWest, northEast],
        minZoom: 17,
        maxZoom: 19, // Lose tiles at 20 and up
        scrollWheelZoom: 'center',
        zoom: 18,
        zoomControl: false
    });
    var zoom = L.control.zoom({'position': 'topright'});
    map.addControl(zoom);

    // Set default map view upon map creation
    if (localStorage) {
        var defaultDataView = localStorage.defaultDataView;
        if (defaultDataView) {
            $(".data-buttons " + defaultDataView).click();
            $(".data-view-defaults " + defaultDataView + " input").prop("checked", true);
        }
    }

    //////////////////////// Generate IDW Interpolation ////////////////////////
    var idw = L.idwLayer(data.nodeLoc , {
        opacity: 0.4,  // Interpolation layer opacity
        maxZoom: 20,
        cellSize: 5,   // CellSize determines interpolation granularity
        exp: 3,        // Exponent used for weighting
        // Max varies based on condition/value
        max: 66,       // Point value ceiling
        gradient: {    // Gradient assignment red (hi) -> violet (lo)
            0.0: 'violet',
            0.1: 'blueviolet',
            0.2: 'blue',
            0.3: 'darkcyan',
            0.4: 'green',
            0.5: 'greenyellow',
            0.6: 'yellowgreen',
            0.7: 'yellow',
            0.8: 'orange',
            0.9: 'orangered',
            1.0: 'red'
        }
    }).addTo(map);

    ////////////////////// Set Property Boundary Vertices //////////////////////
    var propertyBoundary = L.polygon(data.propertyBoundary, {
        fillOpacity: 0
    }).addTo(map);
}

function readyMap() {
    mapsReady = true;
    if (mapsData !== null) {
        createMap(mapsData);
    }
}

function delayMapCreation(data) {
    mapsData = data;
}

// Re-centers the map on double-click
$(window).dblclick(function() {
    map.panTo(mapsData.center);
});

//////////////////////////////// Controls code ////////////////////////////////
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
                        isAnimating = false;
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

//--------------------
    $('#leafwetness-button').click(function() {
				$.ajax({
            url: 'http://localhost:8000/env_data?vineyard_id=0&env_variable=leafwetness',
            type: "GET"
        }).done(function(json) {
            if (json.env_data) {
                window.location.href = "http://localhost:8000/env_data?vineyard_id=0&env_variable=leafwetness";
            } else {
                // go nowhere
                window.location.href = "dashboard.html";
            }
        }).error( function() {
            // go nowhere
            window.location.href = "dashboard.html";
        });
    });


    $('#temperature-button').click(function() {
				$.ajax({
            url: 'http://localhost:8000/env_data?vineyard_id=0&env_variable=temperature',
            type: "GET"
        }).done(function(json) {
            if (json.env_data) {
                window.location.href = "http://localhost:8000/env_data?vineyard_id=0&env_variable=temperature";
            } else {
                // go nowhere
                window.location.href = "dashboard.html";
            }
        }).error( function() {
            // go nowhere
            window.location.href = "dashboard.html";
        });
    });

    $('#humidity-button').click(function() {
				$.ajax({
            url: 'http://localhost:8000/env_data?vineyard_id=0&env_variable=humidity',
            type: "GET"
        }).done(function(json) {
            if (json.env_data) {
                window.location.href = "http://localhost:8000/env_data?vineyard_id=0&env_variable=humidity";
            } else {
                // go nowhere
                window.location.href = "dashboard.html";
            }
        }).error( function() {
            // go nowhere
            window.location.href = "dashboard.html";
        });
    });
//----------------------

    $("#menu-logout").click(function() {
        // Delete access token from local storage.
        delete localStorage.accessToken;

        // Redirect to login page
        window.location = "login.html";
    });
});
