'use strict';


var EventSummaryView = require('EventSummaryView'),
    MagnitudeDetailsView = require('MagnitudeDetailsView'),
    MagnitudeCollectionView = require('MagnitudeCollectionView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeSummaryView = function (options) {

  var _this,
      _initialize,

      _eventSummaryView,
      _magnitudeCollectionView,
      _magnitudeDetailsView;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function () {
    var el;

    el = _this.el;
    el.className = 'magnitude-view';
    el.innerHTML =
        '<header class="magnitude-header">' +
          '<h1>Magnitude Summary</h1>' +
        '</header>' +
        '<section class="magnitude-content">' +
          '<div class="event-summary-view"></div>' +
          '<div class="magnitude-details-view"></div>' +
          '<div class="magnitude-collection-view"></div>' +
        '</div>' +
        '<footer class="magnitude-footer"></footer>';

    _eventSummaryView = EventSummaryView({
      el: el.querySelector('.event-summary-view'),
      model: _this.model
    });
    _eventSummaryView.render();

    _magnitudeCollectionView = MagnitudeCollectionView({
      el: el.querySelector('.magnitude-collection-view'),
      model: _this.model
    });
    _magnitudeCollectionView.render();

    _magnitudeDetailsView = MagnitudeDetailsView({
      el: el.querySelector('.magnitude-details-view'),
      model: _this.model
    });
    _magnitudeDetailsView.render();
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


module.exports = MagnitudeSummaryView;
