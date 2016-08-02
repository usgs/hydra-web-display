'use strict';

var MagnitudeCollectionTable = require('MagnitudeCollectionTable'),
    Collection = require('mvc/Collection'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'event.json',
  success: function (response) {
    var collection,
        magnitudeCollectionTable;

    collection = Collection(response.data.properties.magnitudes);

    magnitudeCollectionTable = MagnitudeCollectionTable({
      el: document.querySelector('#magnitude-collection-table-example'),
      collection: collection
    });

    magnitudeCollectionTable.render();

  },
  error: function (e) {
    console.log(e);
    document.querySelector('#magnitude-collection-table-example').innerHTML = [
      '<p class="alert error">',
        'Failed to create a Magnitude Collection View.',
      '</p>'
    ].join('');
  }
});
