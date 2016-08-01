'use strict';


var EventModel = require('EventModel'),
    EventSummaryView = require('EventSummaryView'),
    Events = require('util/Events'),
    MagnitudeModel = require('MagnitudeModel'),
    MagnitudeTabView = require('MagnitudeTabView'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS;

_DEFAULTS = {
  eventWsUrl: 'event.json',
  magnitudeWsUrl: 'magnitude.json'
};


var MagnitudeDisplay = function (options) {
  var _this,
      _initialize;


  _this = Events(options);

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
      '<div class="magnitude-dispay">',
        '<header class="magnitude-header">',
          '<div class="magnitude-event-summary"></div>',
        '</header>',
        '<section class="magnitude-content">',
          '<div class="magnitude-tabs"></div>',
        '</section>',
        '<footer class="magnitude-footer"></footer>',
      '</div>'
    ].join('');

    _this.eventSummaryView = EventSummaryView({
      el: el.querySelector('.magnitude-event-summary'),
      model: _this.eventModel
    });

    _this.magnitudeTabView = MagnitudeTabView({
      el: el.querySelector('.magnitude-tabs'),
      event: _this.eventModel,
      model: _this.magnitudeModel,
    });

    _this.fetch(_this.parseUrlParams(window.location.hash.replace('#', '')));
  };


  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.fetch = function (params) {
    _this.fetchEventSummary(params);
    _this.fetchMagnitudeDetails(params);
  };

  _this.fetchEventSummary = function (params) {
    Xhr.ajax({
      data: {
        huid: params.huid
      },
      error: _this.onEventWsError,
      success: _this.onEventWsSuccess,
      url: _this.eventWsUrl
    });
  };

  _this.fetchMagnitudeDetails = function (params) {
    Xhr.ajax({
      data: {
        huid: params.huid,
        author: params.author,
        installation: params.installation,
        type: params.type
      },
      error: _this.onMagnitudeWsError,
      success: _this.onMagnitudeWsSuccess,
      url: _this.magnitudeWsUrl
    });
  };

  _this.onEventWsError = function (err/*, xhr*/) {
    console.log(err); // TODO
  };

  _this.onEventWsSuccess = function (response/*, xhr*/) {
    _this.eventModel.reset(
        _this.eventModel.parseAttributes(response));
  };

  _this.onMagnitudeWsError = function (err/*, xhr*/) {
    console.log(err); // TODO
  };

  _this.onMagnitudeWsSuccess = function (response/*, xhr*/) {
    _this.magnitudeModel.reset(
        _this.magnitudeModel.parseAttributes(response));
  };

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
