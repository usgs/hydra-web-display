'use strict';


var EventSearchView = require('EventSearchView');


EventSearchView({
  el: document.querySelector('#event-search-view'),
  eventWsUrl: '/event.json'
});
