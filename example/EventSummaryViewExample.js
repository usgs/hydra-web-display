'use strict';

var EventSummaryView = require('EventSummaryView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: '/event.json',
  success: function (data) {
    var model;

    model = Model(properties);

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
