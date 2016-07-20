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
    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    var depth,
        ev,
        latitude,
        longitude,
        magnitude,
        magnitudeType,
        originTime;

    ev = _this.model.get('event');

    depth = ev.geometry.coordinates[2];
    latitude = ev.geometry.coordinates[0];
    longitude = ev.geometry.coordinates[1];

    magnitude = ev.properties.get('magnitude');
    magnitudeType = ev.properties.get('magnitudeType');
    originTime = ev.properties.get('eventtime');

    _this.el.innerHTML =
      '<dl class="no-style event-summary-list">' +
        '<dt>Preferred Latitude</dt>' +
          '<dd class="latitude">' + latitude + '</dd>' +
        '<dt>Preferred Longitude</dt>' +
          '<dd class="longitude">' + longitude + '</dd>' +
        '<dt>Preferred Origin Time</dt>' +
          '<dd class="origin-time">' + originTime + '</dd>' +
        '<dt>Preferred Depth</dt>' +
          '<dd class="depth">' + depth + '</dd>' +
        '<dt>Preferred Magnitude</dt>' +
          '<dd class="magnitude">' + magnitude + '</dd>' +
        '<dt>Preferred Magnitude Type</dt>' +
          '<dd class="magnitude-type">' + magnitudeType + '</dd>' +
      '</dl>';
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSummaryView;
