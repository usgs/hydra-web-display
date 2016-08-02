'use strict';

var EventSummaryView = require('event/EventSummaryView'),
    EventModel = require('event/EventModel'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: 'event.json',
  success: function (response) {
    var model;

    model = EventModel.fromFeature(response.data);

    EventSummaryView({
      el: document.querySelector('#event-summary-view-example'),
      model: model
    }).render();
  },
  error: function () {
    document.querySelector('#event-summary-view-example').innerHTML = [
      '<p class="alert error">',
        'Failed to create a event summary view.',
      '</p>'
    ].join('');
  }
});
