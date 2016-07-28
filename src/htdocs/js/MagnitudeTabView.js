'use strict';


var MagnitudeSummaryView = require('MagnitudeSummaryView'),
    TabList = require('tablist/TabList'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeTabView = function (options) {
  var _this,
      _initialize;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);


  _initialize = function () {
    _this.el.classList.add('magnitude-tab-view');
    _this.magnitudeSummaryView = MagnitudeSummaryView({
        model: _this.model
    });
  };


  /**
   * Destroy all the things.
   */
  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Add new tabs here.
   */
  _this.addTabs = function () {
    _this.tabList.addTab({
      title: 'Magnitude Summary',
      content: _this.magnitudeSummaryView.el,
      onSelect: function () {
        _this.magnitudeSummaryView.render();
      }
    });
  };

  /**
   * Creates tablist
   */
  _this.render = function () {
    _this.tabList = new TabList({
      el: document.querySelector('.magnitude-tab-view'),
      tabPosition: 'top',
      tabs: []
    });

    _this.addTabs();
  };


  _initialize();
  options = null;
  return _this;
};


module.exports = MagnitudeTabView;
