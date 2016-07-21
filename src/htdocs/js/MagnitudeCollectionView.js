'use strict';


var Formatter = require('Formatter'),
    Util = require('util/Util'),
    CollectionTable = require('mvc/CollectionTable');


var _DEFAULTS;

_DEFAULTS = {
  className: 'magnitude-collection-view',
  clickToSelect: true,
  columns: [
    {
      className: 'id',
      title: 'ID',
      format: function (item) {
        return item.id;
      },
      header: true
    },
    {
      className: 'author',
      title: 'Author',
      format: function (item) {
        return item.author;
      }
    },
    {
      className: 'installation',
      title: 'Installation',
      format: function (item) {
        return item.installation;
      }
    },
    {
      className: 'type',
      title: 'Type',
      format: function (item) {
        return item.type;
      }
    },
    {
      className: 'value',
      title: 'Value',
      format: function (item) {
        return item.value;
      }
    }
  ]
};


var MagnitudeCollectionView = function (options) {
  var _this,
      _initialize,

      _formatter;


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
