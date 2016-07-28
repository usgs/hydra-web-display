'use strict';

var Collection = require('mvc/Collection'),
    EventModel = require('EventModel'),
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
        collection: Collection(eventModel.get('magnitudes').slice(0)),
        el: el,
        model: magnitudeModel
      });
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
  success: function (data) {
    eventModel = EventModel.fromFeature(data);
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
  success: function (data) {
    magnitudeModel = MagnitudeModel.fromFeature(data);
  },
});
