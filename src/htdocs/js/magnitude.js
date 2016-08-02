/* global SERVICE_URL */
'use strict';


var MagnitudeDisplay = require('magnitude/MagnitudeDisplay');


MagnitudeDisplay({
  el: document.querySelector('#magnitude-display'),
  eventWsUrl: SERVICE_URL + '/event.json',
  magnitudeWsUrl: SERVICE_URL + '/magnitude.json'
});
