/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

/////////////////////////////////// On Load ///////////////////////////////////
$(function() {
    // Get information for our current user.
    //TODO: $.ajax({...})
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
        "center": {
            "lat": 45.281041,
            "lng": -123.061896
        },
    });
})

////////////////////////////////// Map code ///////////////////////////////////
var map, mapsReady = false, mapsData = null;
function createMap(data) {
    mapsData = data;
    map = new google.maps.Map($(".map")[0], {
        center: data.center,
        zoom: 18,
        // We may want this as false in browser display.
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    // Add custom controls to the map. This is specifically for mobile view.
    map.controls[google.maps.ControlPosition.LEFT_TOP].push($(".data-buttons").detach()[0]);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($(".menu-control").detach()[0]);

    google.maps.event.addListenerOnce(map, "tilesloaded", function() {
        // Select default heatmap.
        if (localStorage) {
            var defaultDataView = localStorage.defaultDataView;
            if (defaultDataView) {
                $(".data-buttons " + defaultDataView).click();
                $(".data-view-defaults " + defaultDataView + " input").prop("checked", true);
            }
        }
    });
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

$(window).resize(function() {
    map.setCenter(mapsData.center);
});

//////////////////////////////// Controls code ////////////////////////////////
$(function() {
    $("#menu").click(function() {
        var $menu = $(".menu")
        var visible = $menu.is(":visible");
        $menu.show()
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

    $("#menu-logout").click(function() {
        // TODO: log user out.
        window.location = "login.html";
    });
});
