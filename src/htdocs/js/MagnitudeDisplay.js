'use strict';


var EventSummaryView = require('EventSummaryView'),
    MagnitudeTabView = require('MagnitudeTabView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeDisplay = function (options) {

  var _this,
      _initialize,

      _eventSummaryView,
      _magnitudeTabView;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function () {
    var el;

    el = _this.el;
    el.className = 'magnitude-display';
    el.innerHTML =
        '<header class="magnitude-header">' +
          '<h1>Magnitude Summary</h1>' +
        '</header>' +
        '<section class="magnitude-content">' +
          '<div class="event-summary-view"></div>' +
          '<div class="magnitude-tab-view"></div>' +
        '</div>' +
        '<footer class="magnitude-footer"></footer>';

    _eventSummaryView = EventSummaryView({
      el: el.querySelector('.event-summary-view'),
      model: _this.model
    });
    _eventSummaryView.render();

    _magnitudeTabView = MagnitudeTabView({
      el: el.querySelector('.magnitude-tab-view'),
      model: _this.model
    });
    _magnitudeTabView.render();
  };

  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    // TODO
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeDisplay;
