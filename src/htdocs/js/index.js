/* global MOUNT_PATH, SERVICE_URL */
'use strict';


var EventSearchView = require('EventSearchView');


EventSearchView({
  el: document.querySelector('#event-search-view'),
  eventWsUrl: SERVICE_URL + '/event.json',
  magnitudeUrl: MOUNT_PATH + '/magnitude.php'
});
