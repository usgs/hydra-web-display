'use strict';

var EventModel = require('EventModel'),
    MagnitudeModel = require('MagnitudeModel'),
    MagnitudeSummaryView = require('MagnitudeSummaryView'),
    Xhr = require('util/Xhr');


var _initialize;

var el,
    errors,
    eventModel,
    magnitudeModel,
    view;


el = document.querySelector('#magnitude-summary-view-example');
errors = [];

_initialize = function () {
  if (typeof eventModel !== 'undefined' &&
      typeof magnitudeModel !== 'undefined') {
    // both have been set, let's go...
    if (eventModel === null || magnitudeModel === null || errors.length) {
      // something's not right, fail...

      errors.forEach(function (e) {
        console.log(e);
        console.log(e.stack);
      });

      el.innerHTML = '<p class="alert error">' +
          'An error occurred fetching event or magnitude data...</p>';
    } else {
      // ... go ...
      view = MagnitudeSummaryView({
        el: el,
        event: eventModel,
        model: magnitudeModel
      });

      view.render();
    }
  }
};

Xhr.ajax({
  url: 'event.json',
  done: function () {
    _initialize();
  },
  error: function (e) {
    errors.push(e);
    eventModel = null;
  },
  success: function (response) {
    eventModel = EventModel.fromFeature(response.data);
  }
});

Xhr.ajax({
  url: 'magnitude.json',
  done: function () {
    _initialize();
  },
  error: function (e) {
    errors.push(e);
    magnitudeModel = null;
  },
  success: function (response) {
    magnitudeModel = MagnitudeModel.fromFeature(response.data);
  },
});
