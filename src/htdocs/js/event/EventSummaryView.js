'use strict';

var Formatter = require('Formatter'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS,
    _INSTANCE_ID_COUNTER;

_DEFAULTS = {};
_INSTANCE_ID_COUNTER = 0;


var EventSummaryView = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    _this.instanceId = _INSTANCE_ID_COUNTER++;
    _this.formatter = options.formatter || Formatter();

    _this.el.innerHTML =
      '<ul class="no-style event-summary-list">' +
        '<li class="event-summary-origin-time">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-origin-time">' + 'Origin Time' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-origin-time">' + '</span>' +
        '</li>' +
        '<li class="event-summary-time-since">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-time-since">' + 'Time Since' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-time-since">' + '</span>' +
        '</li>' +
        '<li class="event-summary-latitude">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-latitude">' + 'Latitude' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-latitude">' + '</span>' +
        '</li>' +
        '<li class="event-summary-longitude">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-longitude">' + 'Longitude' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-longitude">' + '</span>' +
        '</li>' +
        '<li class="event-summary-depth">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-depth">' + 'Depth' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-depth">' + '</span>' +
        '</li>' +
        '<li class="event-summary-magnitude">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-magnitude">' + 'Magnitude' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-magnitude">' + '</span>' +
        '</li>' +
        '<li class="event-summary-title">' +
          '<label class="event-summary-label" for="event-summary-' +
              _this.instanceId + '-title">' + 'Region' + '</label>' +
          '<span class="event-summary-value" id="event-summary-' +
              _this.instanceId + '-title">' + '</span>' +
        '</li>' +
      '</ul>';

    _this.originTimeEl = _this.el.querySelector(
          '.event-summary-origin-time > .event-summary-value');
    _this.timeSinceEl = _this.el.querySelector(
          '.event-summary-time-since > .event-summary-value');
    _this.latitudeEl = _this.el.querySelector(
          '.event-summary-latitude > .event-summary-value');
    _this.longitudeEl = _this.el.querySelector(
          '.event-summary-longitude > .event-summary-value');
    _this.depthEl = _this.el.querySelector(
          '.event-summary-depth > .event-summary-value');
    _this.magnitudeEl = _this.el.querySelector(
          '.event-summary-magnitude > .event-summary-value');
    _this.titleEl = _this.el.querySelector(
          '.event-summary-title > .event-summary-value');
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
    _this.magnitudeEl.innerHTML = _this.formatter.magnitude(magnitude,
        magnitudeType);
    _this.titleEl.innerHTML = region;

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
