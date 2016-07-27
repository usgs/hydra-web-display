'use strict';


var Collection = require('mvc/Collection'),
    CollectionTable = require('mvc/CollectionTable'),
    Formatter = require('Formatter'),
    Util = require('util/Util');


var _DEFAULTS,
    _FORMATTER;

_FORMATTER = Formatter();

_DEFAULTS = {
  className: 'magnitude-collection-table',
  clickToSelect: true,
  columns: [
    {
      className: 'magnitude-value',
      title: 'Value',
      format: function (item) {
        return _FORMATTER.number(item.value, 1);
      }
    },
    {
      className: 'magnitude-type',
      title: 'Type',
      format: function (item) {
        return item.type;
      }
    },
    {
      className: 'magnitude-author',
      title: 'Author',
      format: function (item) {
        return item.author;
      }
    },
    {
      className: 'magnitude-installation',
      title: 'Installation',
      format: function (item) {
        return item.installation;
      }
    }
  ],
  emptyMarkup: '<p class="alert info">No magnitudes to display.</p>',
  renderNow: true
};


var MagnitudeCollectionTable = function (options) {
  var _this;


  options = Util.extend({collection: Collection()}, _DEFAULTS, options);
  _this = CollectionTable(options);


  options = null;
  return _this;
};


module.exports = MagnitudeCollectionTable;
