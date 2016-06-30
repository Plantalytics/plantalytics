# Plantalytics Front End

Plantalytics is a web app intended to help vintners monitor conditions of 
their vineyards. The front end includes the HTML and JavaScript necessary to 
interpret the values produced by the hardware, and stored in the back end.

## Use

Once properly set up, Plantalytics is accessible through a standard web 
browser, though the frontend is dependent on the backend framework for the 
interpolated data.

## Creating config.js

After forking the repository, create `./js/config.js`. This file should declare 
the following variables:

* `var mapQuestKey` (string value for MapQuest API key)

## Features:
* Display:
    * Inverse distance weighting algorithm interpolates values between nodes 
    smoothly.
    * Values interpreted as colors: violet indicates very low, and red 
    indicates very high.
* Navigation:
    * Scroll area limited to vineyard on display.
    * Double click re-centers view on vineyard.

## Third Party Dependencies

* Leaflet
    * http://leafletjs.com/
* Leaflet.idw (included in this repository)
    * https://github.com/JoranBeaufort/Leaflet.idw
* MapQuest Leaflet Plugins
    * https://developer.mapquest.com/documentation/leaflet-plugins

## License

Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing, Matt Fraser, 
Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.

This project is licensed under the MIT License. Please see the file LICENSE in 
this distribution for license terms.
