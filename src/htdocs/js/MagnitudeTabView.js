'use strict';


var MagnitudeSummaryView = require('MagnitudeSummaryView'),
    EventSummaryView = require('EventSummaryView'),
    TabList = require('tablist/TabList'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeTabView = function (options) {

  var _this,
      _initialize,

      _tabList;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);


  _initialize = function () {
    _this.el.classList.add('magnitude-tab-view');
  };

  _this.destroy = Util.compose(function () {
    _tabList = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  // Add new tabs here
  _this.addTabs = function () {
    _tabList.addTab({
      title: 'Event Summary',
      content: EventSummaryView()
    });

    _tabList.addTab({
      title: 'Magnitude Summary',
      content: MagnitudeSummaryView()
    });
  };

  _this.render = function () {
    _this.el.innerHTML = '';

    _tabList = new TabList({
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
