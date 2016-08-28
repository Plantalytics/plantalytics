# Plantalytics Front End

Plantalytics is a web app intended to help vintners monitor conditions of 
their vineyards. The front end includes the HTML and JavaScript necessary to 
interpret the values produced by the hardware, and stored in the back end.

This system was developed for 
[Plantalytics: Precision Agriculture](http://plantaltyics.us) as part 
of Portland State University's Computer Science Senior Capstone program.

## Use

Once properly set up, the Plantalytics front end is accessible through a 
standard web browser. The function of this part of the project is dependent 
on correct installation and configuration of the 
[back end server](https://github.com/Plantalytics/plantalytics-backend).

## Third Party Dependencies

* Leaflet (CDN)
    * http://leafletjs.com/
* MapQuest Leaflet Plugins (CDN)
    * https://developer.mapquest.com/documentation/leaflet-plugins
* Leaflet.idw (included in this repository, see LEAFLET-IDW-LICENSE for 
licensing details)
    * https://github.com/JoranBeaufort/Leaflet.idw

## Creating config.js

After forking or cloning the repository, create `./js/config.js`. This file 
should declare the following variables:

* `var mapQuestKey = ` (string value for MapQuest API key)
* `var backendIpAddress = ` (string value for the IP address to the 
[back end server](https://github.com/Plantalytics/plantalytics-backend))

## Features:

* User Login
    * Authenticates user sessions based on username and password.
    * Offers users the chance to change a forgotten password.
* Data Interpretation:
    * Inverse distance weighting algorithm (provided by Leaflet.idw) 
    interpolates values between nodes smoothly.
    * Values interpreted as colors: violet indicates very low, and red 
    indicates very high.
    * User can select between temperature, humidity, and leaf wetness values 
    through a graphic interface.
* Navigation:
    * Scroll area limited to vineyard on display.
    * Double click re-centers view on vineyard.
* Settings:
    * Allows user to set a default environmental condition.
    * Allows user to select between their vineyards (if more than one exists).
    * Allows user to reset password.
    
For more detail, including API details, please see the 
[documentation repository](https://github.com/Plantalytics/documentation).

## Contribution

Development on this version of the Plantalytics system has closed. If you 
would like to continue work, you are more than welcome to branch this 
repository, as per the license.

## License

Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing, Matt Fraser, 
Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.

This project is licensed under the MIT License. Please see the file LICENSE in 
this distribution for license terms.
