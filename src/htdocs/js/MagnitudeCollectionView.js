'use strict';


var Formatter = require('Formatter'),
    Util = require('util/Util'),
    CollectionView = require('mvc/CollectionView');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeCollectionView = function (options) {

  var _this,
      _initialize,

      _formatter;

  options = Util.extend({}, _DEFAULTS, options);
  _this = CollectionView(options);

  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
  };

  _this.destroy = Util.compose(function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    _this.el.innerHTML = 'TODO:: MagnitudeCollectionView';
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeCollectionView;