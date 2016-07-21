'use strict';


var Formatter = require('Formatter'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var EventSummaryView = function (options) {

  var _this,
      _initialize,

      _formatter;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
  };

  _this.destroy = Util.compose(function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    _this.el.innerHTML = [
      '<p class="alert info">TODO :: EventSummaryView</p>',
      '<pre>',
        JSON.stringify(_this.model.toJSON(), null, '  '),
      '</pre>'
    ].join('');
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSummaryView;
