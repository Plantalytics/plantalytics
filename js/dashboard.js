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
      window.location = "index.html";
    }

    ({
        "url": "",
        "dataType": "json",
        "done": function (data) {
            if (mapsReady) {
                createMap(data);
            } else {
                delayMapCreation(data);
            }
        }
    }).done({
        // Vineyard center [lat, lon]
        "center": {
            "lat": 45.33821,
            "lng": -123.0487
        },
        // Boundary coords [lat, lon], ...
        // Must be listed in drawing order
        'propertyBoundary': [
            [45.3386, -123.04894],
            [45.3386, -123.04833],
            [45.33781, -123.04834],
            [45.33781, -123.04899],
            [45.33801, -123.04921],
            [45.3382, -123.0492]
        ]
    });
});

////////////////////////////////// Map code ///////////////////////////////////

var map, mapsReady = false, mapsData = null, idw = L.idwLayer([], {});
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

    ////////////////////// Set Property Boundary Vertices //////////////////////
    var propertyBoundary = L.polygon(data.propertyBoundary, {
        fillOpacity: 0
    }).addTo(map);

    ////////////////////////    Set Default Map View    ////////////////////////
    //////////////////////// Generate IDW Interpolation ////////////////////////
    if (localStorage) {
        if (!localStorage.defaultDataView) {
            localStorage.defaultDataView = '.data-button-label.temperature';
        }
        $(".data-buttons " + localStorage.defaultDataView + " input").click();
        $(".data-view-defaults " + localStorage.defaultDataView + " input").prop("checked", true);
    }
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
