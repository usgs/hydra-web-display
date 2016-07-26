'use strict';

var MagnitudeTabView = require('MagnitudeTabView');
    //Xhr = require('util/Xhr');


var magnitudeTabView = MagnitudeTabView({
  el: document.querySelector('#magnitude-tab-view-example')
});

magnitudeTabView.render();
// Xhr.ajax({
//   url: 'event.json',
//   success: function (data) {
//     var model;
//
//     model = EventModel.fromFeature(data);
//
//     MagnitudeTabView({
//       el: document.querySelector('#magnitude-tab-view-example'),
//       model: model
//     }).render();
//   },
//   error: function () {
//     document.querySelector('#magnitude-tab-view-example').innerHTML = [
//       '<p class="alert error">',
//         'Failed to create a event summary view.',
//       '</p>'
//     ].join('');
//   }
// });
