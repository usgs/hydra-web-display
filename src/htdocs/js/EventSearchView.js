'use strict';


var MagnitudeCollectionView = require('MagnitudeCollectionView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var EventSearchView = function (options) {

  var _this,
      _initialize,

      _magnitudeCollectionView;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function () {
    var el;

    el = _this.el;
    el.innerHTML =
        '<article class="event-search-view">' +
          '<header class="event-search-header">' +
            '<h1>Search for an Event</h1>' +
            '<input type="text" name="huid" id="huid-search" ' +
                'placeholder="HUID" />' +
            '<button class="event-search-button">search</button>' +
          '</header>' +
          '<section class="event-search-content">' +
            '<div class="magnitude-collection-view"></div>' +
          '</div>' +
          '<footer class="event-search-footer"></footer>' +
        '</article>';

    _magnitudeCollectionView = MagnitudeCollectionView({
      el: el.querySelector('.magnitude-collection-view'),
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


module.exports = EventSearchView;
