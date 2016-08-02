'use strict';


var EventModel = require('EventModel'),
    EventSummaryView = require('EventSummaryView'),
    Events = require('util/Events'),
    MagnitudeModel = require('MagnitudeModel'),
    MagnitudeTabView = require('MagnitudeTabView'),
    Message = require('util/Message'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS;

_DEFAULTS = {
  eventWsUrl: 'event.json',
  magnitudeWsUrl: 'magnitude.json'
};


/**
 * This is a top-level class for rendering the Hydra Magnitude Display.
 *
 * @param options {Object}
 *     See MagnitudeDisplay#_initialize documentation for details.
 */
var MagnitudeDisplay = function (options) {
  var _this,
      _initialize;


  _this = Events(options);

  /**
   * Constructor. Creates a new MagnitudeDisplay object.
   *
   * @param options {Object}
   *     Configuration options for this display. See below ...
   * @param options.el {HTMLElement}
   *     The container into which this display should be rendered.
   * @param options.eventModel {EventModel}
   *     The model containing event information to render.
   * @param options.magnitudeModel {MagnitudeModel}
   *     The model containing magnitude information to render.
   * @param eventWsUrl {String}
   *     The event web service URL from which event data is fetched.
   * @param magnitudeWsUrl {String}
   *     The magnitude web service URL from which magnitude data is fetched.
   */
  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    _this.el = options.el || document.createElement('div');
    _this.eventModel = options.eventModel || EventModel();
    _this.magnitudeModel = options.magnitudeModel || MagnitudeModel();

    _this.eventWsUrl = options.eventWsUrl;
    _this.magnitudeWsUrl = options.magnitudeWsUrl;

    el = _this.el;
    el.innerHTML = [
      '<div class="magnitude-display">',
        '<header class="magnitude-header">',
          '<div class="magnitude-event-summary"></div>',
        '</header>',
        '<section class="magnitude-content">',
          '<div class="magnitude-tabs"></div>',
        '</section>',
        '<footer class="magnitude-footer">',
          '<div class="errors"></div>',
        '</footer>',
      '</div>'
    ].join('');

    _this.errorsEl = el.querySelector('.errors');

    _this.eventSummaryView = EventSummaryView({
      el: el.querySelector('.magnitude-event-summary'),
      model: _this.eventModel
    });

    _this.magnitudeTabView = MagnitudeTabView({
      el: el.querySelector('.magnitude-tabs'),
      event: _this.eventModel,
      model: _this.magnitudeModel
    });

    _this.fetch(_this.parseUrlParams(window.location.hash.replace('#', '')));

    Events.on('hashchange', 'onHashChange', _this);
  };


  /**
   * Frees resources associated with this display. If any AJAX calls are pending,
   * they are all aborted. Sub-views are destroyed.
   *
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    if (_this.eventSummaryView) {
      _this.eventSummaryView.destroy();
      _this.eventSummaryView = null;
    }

    if (_this.magnitudeTabView) {
      _this.magnitudeTabView.destroy();
      _this.magnitudeTabView = null;
    }

    if (_this.eventAjaxHandler &&
        typeof _this.eventAjaxHandler.abort === 'function') {
      _this.eventAjaxHandler.abort();
      _this.eventAjaxHandler = null;
    }

    if (_this.magnitudeAjaxHandler &&
        typeof _this.magnitudeAjaxHandler.abort === 'function') {
      _this.magnitudeAjaxHandler.abort();
      _this.magnitudeAjaxHandler = null;
    }

    Events.off('hashchange', 'onHashChange', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Fetches event and magnitude data based on the given params. This method
   * returns almost immediately while the actual fetch is performed
   * asynchronously.
   *
   * @param params {Object}
   *     An object describing the event/magnitude data to fetch. Particularly,
   *     this should include `huid`, `author`, `installation`, and `type`
   *     properties.
   */
  _this.fetch = function (params) {
    _this.fetchEventSummary(params);
    _this.fetchMagnitudeDetails(params);
  };

  /**
   * Fetches event summary data based on the given params. This method returns
   * almost immediately while the actual fetch is performed asynchronously. If
   * a previous asynchronous call has not yet resolved, it is aborted
   * prior to a subsequent request being initiated.
   *
   * @param params {Object}
   *     An object describing the event data to fetch. Particularly this should
   *     include the `huid` property.
   */
  _this.fetchEventSummary = function (params) {
    params = params || {};

    if (_this.eventAjaxHandler &&
        typeof _this.eventAjaxHandler.abort === 'function') {
      _this.eventAjaxHandler.abort();
      _this.eventAjaxHandler = null;
    }

    _this.eventAjaxHandler = Xhr.ajax({
      data: {
        huid: params.huid
      },
      done: function () { _this.eventAjaxHandler = null; },
      error: _this.onEventWsError,
      success: _this.onEventWsSuccess,
      url: _this.eventWsUrl
    });
  };

  /**
   * Fetches magnitude data based on the given params. This method returns
   * almost immediately while the actual fetch is performed asynchronously. If
   * a previous asynchronous call has not yet resolved, it is aborted
   * prior to a subsequent request being initiated.
   *
   * @param params {Object}
   *     An object describing the magnitude data to fetch. Particularly this
   *     should include the `huid`, `author`, `installation`, and `type`
   *     properties.
   */
  _this.fetchMagnitudeDetails = function (params) {
    params = params || {};

    if (_this.magnitudeAjaxHandler &&
        typeof _this.magnitudeAjaxHandler.abort === 'function') {
      _this.magnitudeAjaxHandler.abort();
      _this.magnitudeAjaxHandler = null;
    }

    _this.magnitudeAjaxHandler = Xhr.ajax({
      data: {
        huid: params.huid,
        author: params.author,
        installation: params.installation,
        type: params.type
      },
      done: function () { _this.magnitudeAjaxHandler = null; },
      error: _this.onMagnitudeWsError,
      success: _this.onMagnitudeWsSuccess,
      url: _this.magnitudeWsUrl
    });
  };

  /**
   * Callback method when an error occurs during the process of fetching
   * event data. Shows an error message to the user.
   *
   * @param err {Error|String}
   *     The error that caused this method to be called.
   */
  _this.onEventWsError = function (err/*, xhr*/) {
    Message({
      container: _this.errorsEl,
      content: err.message || err,
      autoclose: 0,
      classes: ['alert', 'error']
    });
  };

  /**
   * Callback method when receiving event data response from the web service.
   * Parses the response and updates all the event model properties which
   * should, in-turn, cause bound views to render.
   *
   * @param response {Object}
   *     The response object received from the web service.
   */
  _this.onEventWsSuccess = function (response/*, xhr*/) {
    _this.eventModel.reset(
        _this.eventModel.parseAttributes(response));
  };

  /**
   * Reloads page on a hash change.
   *
   * This forces the correct parameters to load when a new magnitude is
   * selected from the MagnitudeSummaryTable.
   *
   */
  _this.onHashChange = function () {
    window.location.reload();
  };

  /**
   * Callback method when an error occurs during the process of fetching
   * magnitude data. Shows an error message to the user.
   *
   * @param err {Error|String}
   *     The error that caused this method to be called.
   */

  _this.onMagnitudeWsError = function (err/*, xhr*/) {
    Message({
      container: _this.errorsEl,
      content: err.message || err,
      autoclose: 0,
      classes: ['alert', 'error']
    });
  };

  /**
   * Callback method when receiving magnitude data response from the web
   * service. Parses the response and updates all the event model properties
   * which should, in-turn, cause bound views to render.
   *
   * @param response {Object}
   *     The response object received from the web service.
   */
  _this.onMagnitudeWsSuccess = function (response/*, xhr*/) {
    _this.magnitudeModel.reset(
        _this.magnitudeModel.parseAttributes(response));
  };

  /**
   * Parses Url parameters similar to a query string. It ignores any unexpected
   * parameter.
   *
   * @param hash {String}
   *     The Url hash to parse. This should _NOT_ include the leading '#'
   *     character and should be of the form: ?key1=val1&key2=val2...
   * @return {Object}
   *     An object with `huid`, `author`, `installation`, and `type`
   *     properties as they were parsed from the given hash. These property
   *     values may be null if the given hash did not specify a value.
   */
  _this.parseUrlParams = function (hash) {
    var params;

    params = {
      huid: null,
      author: null,
      installation: null,
      type: null
    };

    hash = hash.split('?');
    if (hash && hash.length > 1) {
      hash = hash[1];
      hash = hash.split('&');

      hash.forEach(function (param) {
        var key,
            parts,
            value;

        parts = param.split('=');
        if (parts && parts.length > 1) {
          key = parts[0];
          value = parts[1];

          // Only set parameters that we expect
          if (params.hasOwnProperty(key)) {
            params[key] = value;
          }
        }
      });
    }

    return params;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeDisplay;
