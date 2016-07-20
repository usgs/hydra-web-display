'use strict';


var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeTabView = function (options) {

  var _this,
      _initialize;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    _this.el.innerHTML = 'TODO:: MagnitudeTabView';
  };

  options = null;
  return _this;
};


module.exports = MagnitudeTabView;