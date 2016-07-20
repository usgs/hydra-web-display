'use strict';


var Formatter = require('Formatter'),
    Util = require('util/Util'),
    CollectionTable = require('mvc/CollectionTable');


var _DEFAULTS,
    _FORMATTER;


_FORMATTER = Formatter();
_DEFAULTS = {
  className: 'collection-table',
  clickToSelect: true,
  columns: [
    {
      className: 'magnitude-value',
      title: 'Magnitude Value',
      format: function (item) { return _FORMATTER.number(item.value, 1); }
    },
    {
      className: 'magnitude-type',
      title: 'Magnitude Type',
      format: function (item) { return item.type; }
    },
    {
      className: 'magnitude-source',
      title: 'Magnitude Source',
      format: function (item) { return item.author; }
    },
  ],
  emptyMarkup: 'No Magnitudes to display',
  renderNow: true
};



var MagnitudeCollectionView = function (options) {

  var _this,
      _initialize,

      _formatter,
      _onClick;

  options = Util.extend({}, _DEFAULTS, options);
  _this = CollectionTable(options);

  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
  };

  _this.destroy = Util.compose(function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeCollectionView;