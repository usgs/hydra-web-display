'use strict';


var MagnitudeSummaryView = require('MagnitudeSummaryView'),
    TabList = require('tablist/TabList'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {
  // Ordered list of configured tabs to add automatically.
  // @see MagnitudeTabView#_addTab for documentation on what keys may
  //                               be used in each "tab"
  tabs: [
    // Summary
    {
      factory: MagnitudeSummaryView,
      id: 'summary',
      title: 'Summary',
    }
  ]
};


/**
 * Creates a tabbed layout for the magntiude display.
 *
 */
var MagnitudeTabView = function (options) {
  var _this,
      _initialize,

      _createTabList;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  /**
   * Constructor for this view. Creates the tab list instance and initializes
   * default tabs as configured in options.tabs.
   *
   * @param options {Object}
   *     Configuration options for this view.
   * @param options.tabs {Array}
   *     An ordered list of tabs to add during construction
   */
  _initialize = function (options) {
    _this.el.innerHTML = '<div class="magnitude-tab-view-tabs"></div>';

    _this.views = {};
    _this.tabs = {};

    // Create an empty tab list to add tabs to
    _this.tabList = TabList({
      el: _this.el.querySelector('.magnitude-tab-view-tabs'),
      tabs: []
    });

    // Add all configured tabs
    options.tabs.forEach(function (params) {
      _this._addTab(params);
    });
  };


  /**
   * Creates (or recreates) a specific view/tab based on the given configuration
   * options.
   *
   * @param params {Object}
   *     params for creating the tab/view.
   * @param params.factory {Function}
   *     The factory method to call in order to create a new view.
   * @param params.id {String}
   *     The unique ID for the tab/view to be created.
   * @param params.options {Object}
   *     Configuration params to provide to the `factory`. These
   *     will be extended with {model: _this.model}.
   * @param params.title {String}
   *     The string to use as a title in the tab.
   */
  _this._addTab = function (params) {
    var factory,
        id,
        options,
        tab,
        title,
        view;

    id = params.id || 'id';
    title = params.title || 'Title';
    factory = params.factory || View;
    options = params.options || {};

    // Create or recreate the view
    view = _this.views[id];
    if (view && typeof view.destroy === 'function') {
      view.destroy();
      _this.views[id] = null;
    }

    view = factory(Util.extend({model: _this.model}, options));
    _this.views[id] = view;

    // Create the tab or use existing tab. TabList does not currently support
    // removing a specific tab in order to replace it, but by holding a
    // reference to the created tab, we can augment it to swap out content
    // if needed.
    tab = _this.tabs[id];
    if (tab) {
      tab.options.content = view.el;

      if (tab.tabEl.classList.contains('tablist-tab-selected')) {
        // Tab is selected, must update panel content
        Util.empty(tab.panelEl);
        tab.panelEl.appendChild(view.el);
      } else {
        // Force next select to look at new view
        tab.contentReady = false;
      }
    } else {
      tab = {
        title: title,
        content: view.el,
        onSelect: function () {
          _this.views[id].render();
        }
      };

      tab = _this.tabList.addTab(tab);
      _this.tabs[id] = tab;
    }
  };


  /**
   * Destroy all the things.
   *
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    // Destroy sub-views first
    Object.keys(_this.views).forEach(function (id) {
      var view;

      view = _this.views[id];
      if (view && typeof view.destroy === 'function') {
        view.destroy();
      }
      _this.views[id] = null;
    });

    // Now destroy TabList itself
    if (_this.tabList && typeof _this.tabList.destroy === 'function') {
      _this.tabList.destroy();
    }

    // Clean up remaining resources
    _createTabList = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeTabView;
