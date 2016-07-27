'use strict';

var MagnitudeCollectionTable = require('MagnitudeCollectionTable'),
    Model = require('mvc/Model'),
    Collection = require('mvc/Collection'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: 'event.json',
  success: function (data) {
    var collection,
        magnitudeCollectionTable;

    collection = Collection(data.properties.magnitudes);

    magnitudeCollectionTable = MagnitudeCollectionTable({
      el: document.querySelector('#magnitude-collection-table-example'),
      model: Model(data),
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
