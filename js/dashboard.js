/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

$.getScript('http://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=' + mapQuestKey, readyMap);

// Used for storing the list of selectable vineyards
var selectableVineyardsList = [];

/////////////////////////////////// On Load ///////////////////////////////////

$(function() {
    // Make sure the user has a login token before continuing.
    if (!localStorage.accessToken) {
      window.location = "index.html";
    }

    // Set up vineyard selection dropdown
    setUpVineyardSelectionDropdown();

    // Perform call to vineyard endpoint
    $.ajax({
        "url": backendIpAddress + "vineyard",
        "data": JSON.stringify({
            "auth_token": localStorage.accessToken,
            "vineyard_id": localStorage.selectedVineyard
        }),
        "type": "POST"
    }).done(function(data) {
        if (mapsReady) {
            createMap(data);
        } else {
            delayMapCreation(data);
        }
    });
});

////////////////////////////////// Map code ///////////////////////////////////

var map, mapsReady = false, mapsData = null, idw = L.idwLayer([], {});
function createMap(data) {
    // Calculate map bounds
    var latOffset = .00145; // Perhaps calculate these offsets based
    var lngOffset = .00525; //   on the surface area of the vineyard.
    var southWest = {'lat': data.center.lat - latOffset, 'lng': data.center.lon - lngOffset};
    var northEast = {'lat': data.center.lat + latOffset, 'lng': data.center.lon + lngOffset};

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
    var propertyBoundary = L.polygon(data.boundary, {
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

function setUpVineyardSelectionDropdown() {
    // Grab instance of header
    var changeVineyardHeader = $('#menu-change-vineyard-header');

    var authorizedVineyards = JSON.parse(localStorage.authorizedVineyards);
    authorizedVineyards.forEach(function(vineyardObject) {
        // Create menu entry
        var currentVineyardEntry = $("<div />")
            .addClass("menu-item")
            .val(vineyardObject.vineyard_id)
            .text(vineyardObject.vineyard_name)
            .click(function(event) {
                updateSelectedVineyard(event.target.value);
            })

        // Set initial vineyard selection.
        if (currentVineyardEntry.val() == localStorage.selectedVineyard) {
            currentVineyardEntry.removeClass("menu-item").addClass("menu-item-selected");
        }

        // Add vineyards below header.
        changeVineyardHeader.after(currentVineyardEntry);

        // Add to selectable vineyards list for later query.
        selectableVineyardsList.push(currentVineyardEntry);
    });
}

function updateSelectedVineyard(selectedVineyardId) {
    console.log("Selected vineyard id is: " + selectedVineyardId);
    // Iterate through vineyards and deselect old, if applicable
    selectableVineyardsList.forEach(function (currentVineyardEntry) {
        // Deselect selected vineyard
        if (currentVineyardEntry.val() == localStorage.selectedVineyard) {
            // Unselect the entry
            currentVineyardEntry.removeClass("menu-item-selected").addClass("menu-item");
        }

        // Select new vineyard
        if (currentVineyardEntry.val() == selectedVineyardId) {
            // Select the entry
            currentVineyardEntry.removeClass("menu-item").addClass("menu-item-selected");
        }
    });

    // Update selected vineyard
    localStorage.selectedVineyard = selectedVineyardId;

    // TODO: Don't reload page?
    location.reload(true);
}

// Re-centers the map on double-click
$(window).dblclick(function() {
    map.panTo(mapsData.center);
});
