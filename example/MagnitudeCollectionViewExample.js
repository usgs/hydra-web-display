'use strict';

var MagnitudeCollectionView = require('MagnitudeCollectionView'),
    Collection = require('mvc/Collection'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'event.json',
  success: function (data) {
    var collection;

    collection = Collection(data.properties.magnitudes);

    MagnitudeCollectionView({
      el: document.querySelector('#magnitude-collection-view-example'),
      data: collection
    }).render();
  },
  error: function () {
    document.querySelector('#magnitude-collection-view-example').innerHTML = [
      '<p class="alert error">',
        'Failed to create a Magnitude Collection View.',
      '</p>'
    ].join('');
  }
});
