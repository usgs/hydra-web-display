'use strict';


var EventSummaryView = require('EventSummaryView'),
    MagnitudeCollectionView = require('MagnitudeCollectionView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var HydraDisplayView = function (options) {

  var _this,
      _initialize,

      _eventSummaryView,
      _magnitudeCollectionView;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function () {
    var el;

    el = _this.el;
    el.innerHTML =
        '<header class="hydra-display-header">' +
          '<h1>Hydra Web Display</h1>' +
        '</header>' +
        '<section class="hydra-display-content">' +
          '<div class="hydra-display-event-summary"></div>' +
          '<div class="hydra-display-magnitude-collection"></div>' +
        '</div>' +
        '<footer class="hydra-display-footer">' +
          '<div>TODO:: Hydra Web Display Footer</div>' +
        '</footer>';

    _eventSummaryView = EventSummaryView({
      el: el.querySelector('.hydra-display-event-summary'),
      model: _this.model
    });
    _eventSummaryView.render();

    _magnitudeCollectionView = MagnitudeCollectionView({
      el: el.querySelector('.hydra-display-magnitude-collection'),
      model: _this.model
    });
    _magnitudeCollectionView.render();
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


module.exports = HydraDisplayView;