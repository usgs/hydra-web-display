'use strict';


var TabList = require('tablist/TabList'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var MagnitudeTabView = function (options) {

  var _this,
      _initialize,

      _tablist;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);
  _tablist = TabList();

  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.tabList = function () {
    _tablist({
      el: document.querySelector('.magnitude-tab-view'),
      tabs: [
        {
          title: '<header>Tab #1</header>',
          content: '<header>Tab #1 content</header>' +
              '<p>content stuff</p>'
        }
      ]
    });
  };

  _this.addTab = function () {

  };

  _this.render = function () {
    _this.el.innerHTML = 'TODO:: MagnitudeTabView';
  };

  options = null;
  return _this;
};


module.exports = MagnitudeTabView;
