'use strict';

var Formatter = require('Formatter'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


var EventSummaryView = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    _this.formatter = options.formatter || Formatter();

    _this.el.innerHTML =
      '<ul class="no-style event-summary-list">' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-origin-time">' +
            'Origin Time: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-origin-time">' +
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
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-longitude">' +
            'Longitude: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-longitude">' +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-depth">' +
            'Depth: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-depth">' +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-magnitude">' +
            'Magnitude: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-magnitude">' +
          '</span>' +
        '</li>' +
        '<li>' +
          '<label class="event-summary-label" for="event-summary-title">' +
            'Region: ' +
          '</label>' +
          '<span class="event-summary-value" id="event-summary-title">' +
          '</span>' +
        '</li>' +
      '</ul>';

    _this.originTimeEl = _this.el.querySelector('#event-summary-origin-time');
    _this.timeSinceEl = _this.el.querySelector('.timer-count-up');
    _this.latitudeEl = _this.el.querySelector('#event-summary-latitude');
    _this.longitudeEl = _this.el.querySelector('#event-summary-longitude');
    _this.depthEl = _this.el.querySelector('#event-summary-depth');
    _this.magnitudeEl = _this.el.querySelector('#event-summary-magnitude');
    _this.regionEl = _this.el.querySelector('#event-summary-title');
  };


  /**
   * Starts counter for time since event.
   *
   * @param startTime {string}
   *    Formatted date. example: "2016-07-19T05:18:38.58Z"
   */
  _this.beginTimeSinceCounter = function (startTime) {
    if (_this.timeSinceIntervalHandler) {
      window.clearInterval(_this.timeSinceIntervalHandler);
      _this.timeSinceIntervalHandler = null;
    }

    _this.updateTimeSince(startTime);

    _this.timeSinceIntervalHandler = window.setInterval(function () {
      _this.updateTimeSince(startTime);
    }, 1000);
  };

  /**
   * Destroy all the things.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    if (_this.timeSinceIntervalHandler) {
      window.clearInterval(_this.timeSinceIntervalHandler);
      _this.timeSinceIntervalHandler = null;
    }

    _initialize = null;
    _this = null;
  }, _this.destroy);

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

    _this.originTimeEl.innerHTML = originTime;
    _this.latitudeEl.innerHTML = _this.formatter.latitude(latitude);
    _this.longitudeEl.innerHTML = _this.formatter.longitude(longitude);
    _this.depthEl.innerHTML = _this.formatter.depth(depth, 'km');
    _this.magnitudeEl.innerHTML = _this.formatter.magnitude(magnitude, magnitudeType);
    _this.regionEl.innerHTML = region;

    _this.beginTimeSinceCounter(originTime);
  };

  /**
   * Updates and formats time.
   *
   * @param startTime {string}
   *    Formatted date. example: "2016-07-19T05:18:38.58Z"
   */
  _this.updateTimeSince = function (startTime) {
    var now,
        timeSince;

    now = (new Date()).getTime();
    startTime = Date.parse(startTime);
    timeSince = parseInt((now - startTime) / 1000, 10); // seconds

    _this.timeSinceEl.innerHTML = _this.formatter.timeSince(timeSince);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSummaryView;
