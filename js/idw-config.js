/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

var idwOptions = {
  opacity: 0.4,  // Interpolation layer opacity
  maxZoom: 20,
  cellSize: 5,   // CellSize determines interpolation granularity
  exp: 3,        // Exponent used for weighting
  // Max varies based on condition/value
  max: 100,       // Point value ceiling
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
};
