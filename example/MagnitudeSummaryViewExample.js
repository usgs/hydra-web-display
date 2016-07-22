'use strict';

var Collection = require('mvc/Collection'),
    MagnitudeSummaryView = require('MagnitudeSummaryView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'magnitude.json',
  success: function (data) {
    var magnitudeCollectionView,
        magnitudes;

    magnitudes = [
      Model({
        'id': '50003UWR/wphase_module/NEIC/Mww',
        'author': 'wphase_module',
        'installation': 'NEIC',
        'type': 'Mww',
        'value': 5.768
      }),
      Model({
        'id': '50003UWR/author/installation/Mqa',
        'author': 'author',
        'installation': 'installation',
        'type': 'Mww',
        'value': 5.012
      }),
    ];

    magnitudeCollectionView = MagnitudeSummaryView({
      el: document.querySelector('#magnitude-summary-view-example'),
      collection: Collection(magnitudes),
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
