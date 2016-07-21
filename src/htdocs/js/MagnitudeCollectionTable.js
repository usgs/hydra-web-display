'use strict';


var Collection = require('mvc/Collection'),
    Formatter = require('Formatter'),
    Util = require('util/Util'),
    CollectionTable = require('mvc/CollectionTable');


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
      format: function (item) { return _FORMATTER.number(item.value, 1); }
    },
    {
      className: 'magnitude-type',
      title: 'Type',
      format: function (item) { return item.type; }
    },
    {
      className: 'magnitude-source',
      title: 'Source',
      format: function (item) { return item.author; }
    }
  ],
  emptyMarkup: 'No Magnitudes to display',
  renderNow: true
};


var MagnitudeCollectionTable = function (options) {

  var _this,
      _initialize,

      _collection,

      _onSelect;

  options = Util.extend({collection: Collection()}, _DEFAULTS, options);
  _this = CollectionTable(options);

  _initialize = function (options) {
    _collection = options.collection;
    _collection.on('select', _onSelect);
  };

  _this.destroy = Util.compose(function () {
    if (_collection) {
      _collection.off('select', _onSelect);
    }
    _onSelect = null;

    _collection = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _onSelect = function (e) {
    _this.onSelect(e);
  };

  _this.onSelect = function (magnitude) {
    var author,
        huid,
        installation,
        link,
        type;

    author = magnitude.author || '';
    huid = _this.model.get('id') || '';
    installation = magnitude.installation || '';
    type = magnitude.type || '';

    link = 'magnitude.html#?author=' + author + '&id=' + huid +
        '&installation=' + installation + '&type=' + type;

    window.location.href = link;
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeCollectionTable;