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
        latitude,
        longitude,
        magnitude,
        magnitudeType,
        originTime;

    depth = _this.model.get('depth');
    latitude = _this.model.get('latitude');
    longitude = _this.model.get('longitude');
    magnitude = _this.model.get('magnitude');
    magnitudeType = _this.model.get('magnitudeType');
    originTime = _this.model.get('eventtime');

    depth = _formatter.depth(depth, 'km');
    latitude = _formatter.latitude(latitude);
    longitude = _formatter.longitude(longitude);
    magnitude = _formatter.magnitude(magnitude, magnitudeType);

    _this.el.innerHTML =
      '<ul class="no-style event-summary-view">' +
        '<li class="origin-time"><b>OT:</b> ' + originTime + '</li>' +
        '<li class="latitude"><b>Lat:</b> '  + latitude + '</li>' +
        '<li class="longitude"><b>Lon:</b> ' + longitude + '</li>' +
        '<li class="depth"><b>Depth:</b> ' + depth + '</li>' +
        '<li class="magnitude"><b>Mag:</b> ' + magnitude + '</li>' +
      '</ul>';
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSummaryView;
