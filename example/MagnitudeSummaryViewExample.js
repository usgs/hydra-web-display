'use strict';

var MagnitudeSummaryView = require('MagnitudeSummaryView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'event.json',
  success: function (data) {
    var magnitudeCollectionView;

    magnitudeCollectionView = MagnitudeSummaryView({
      el: document.querySelector('#magnitude-summary-view-example'),
      model: Model(data)
    });
    magnitudeCollectionView.render();

  },
  error: function (e) {
    console.log(e);
    document.querySelector('#magnitude-summary-view-example').innerHTML = [
      '<p class="alert error">',
        'Failed to create a Magnitude Summary View.',
      '</p>'
    ].join('');
  }
});
