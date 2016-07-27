'use strict';

var Formatter = require('Formatter'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var EventSummaryView = function (options) {

  var _this,
      _initialize,

      _formatter;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
  };


  _this.destroy = Util.compose(function () {
    if (_this.counterIntervalHandler) {
      window.clearInterval(_this.counterIntervalHandler);
      _this.counterIntervalHandler = null;
    }

    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.timerCountUp = function (datetime) {
    var current,
        milliseconds,
        elapsed;

    _this.timeSinceEl = _this.el.querySelector('.timer-count-up');

    try {
      current = new Date().getTime();
      milliseconds = Date.parse(datetime);
      elapsed = Math.floor((current - milliseconds) / 1000);
    } catch (e) {
      _this.timeSinceEl.innerHTML = '';
      return;
    }

    _this.counterIntervalHandler = window.setInterval(function () {
      var clock,
          days,
          hrs,
          mins,
          secs,
          weeks;

      elapsed++;
      weeks = Math.floor(elapsed/604800);
      days = Math.floor(elapsed/86400) % 7;
      hrs = Math.floor(elapsed/3600) % 24;
      mins = Math.floor(elapsed/60) % 60;
      secs = elapsed % 60;

      clock =
        (weeks ? weeks + ' weeks, ' : '') +
        (days ? days + ' days, ' : '') +
        (hrs ? hrs + ':' : '') +
        (mins < 10 ? '0' + mins + ':' : mins + ':') +
        (secs < 10 ? '0' + secs : secs);

      _this.timeSinceEl.innerHTML = clock;
    }, 1000);
  };

  _this.render = function () {
    var depth,
        latitude,
        longitude,
        magnitude,
        magnitudeType,
        originTime,
        region;

    depth = _this.model.get('depth');
    latitude = _this.model.get('latitude');
    longitude = _this.model.get('longitude');
    magnitude = _this.model.get('magnitude');
    magnitudeType = _this.model.get('magnitudeType');
    originTime = _this.model.get('eventtime');
    region = _this.model.get('title');

    depth = _formatter.depth(depth, 'km');
    latitude = _formatter.latitude(latitude);
    longitude = _formatter.longitude(longitude);
    magnitude = _formatter.magnitude(magnitude, magnitudeType);

    _this.el.innerHTML =
      '<ul class="no-style event-summary-list">' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-origin-time">' +
            'Origin Time: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-origin-time">' +
            originTime +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-time-since">' +
            'Time Since: ' +
          '</label>' +
          '<span class="event-summary-value timer-count-up"' +
              'id="event-summary-time-since">' +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-latitude">' +
            'Latitude: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-latitude">' +
            latitude +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-longitude">' +
            'Longitude: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-longitude">' +
            longitude +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-depth">' +
            'Depth: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-depth">' +
            depth +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-magnitude">' +
            'Magnitude: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-magnitude">' +
            magnitude +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-title">' +
            'Region: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-title">' +
            region +
          '</span>' +
        '</li>' +
      '</ul>';

      _this.timerCountUp(originTime);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSummaryView;
