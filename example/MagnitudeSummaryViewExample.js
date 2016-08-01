'use strict';

var Collection = require('mvc/Collection'),
    MagnitudeSummaryView = require('MagnitudeSummaryView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'magnitude.json',
  success: function (data) {
    var magnitudeSummaryView;

    magnitudeSummaryView = MagnitudeSummaryView({
      el: document.querySelector('#magnitude-summary-view-example'),
      collection: Collection([
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
        })
      ]),
      ev: Model({
        'id': '50003UWR',
        'geometry': {
          'coordinates': [
            -30.171801, -72.155899, 5.14
          ],
          'type': 'Point'
        },
        'eventtime': '2016-07-19T05:18:38.58Z',
        'magnitude': 5.224,
        'magnitudeType': 'Ms_20',
        'title': 'OFFSHORE COQUIMBO, CHILE',
        'type': 'Earthquake'
      }),
      model: Model(data)
    });
    magnitudeSummaryView.render();

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
