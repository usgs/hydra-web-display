'use strict';

var Util = require('util/Util');


// default options
var _DEFAULTS = {
  // decimal places for depth
  depthDecimals: 1,
  // decimal places for distance
  distanceDecimals: 1,
  // content when a value is missing
  empty: '&ndash;',
  // size abbreviations for [bytes, kilobytes, megabytes, gigabytes]
  fileSizes: [' B', ' KB', ' MB', ' GB'],
  // decimal places for latitude/longitude
  locationDecimals: 3,
  // decimal places for magnitude
  magnitudeDecimals: 1
};


var _MILES_PER_KILOMETER = 0.621371;

var _MMI_ARRAY = ['I', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII',
    'IX', 'X', 'XI', 'XII'];


/**
 * Construct a new Formatter.
 *
 * @param options {Object}
 *        formatter options.
 */
var Formatter = function (options) {
  var _this,
      _initialize,

      _depthDecimals,
      _distanceDecimals,
      _empty,
      _fileSizes,
      _locationDecimals,
      _magnitudeDecimals;

  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _depthDecimals = options.depthDecimals;
    _distanceDecimals = options.distanceDecimals;
    _empty = options.empty;
    _fileSizes = options.fileSizes;
    _locationDecimals = options.locationDecimals;
    _magnitudeDecimals = options.magnitudeDecimals;
  };


  _this.angle = function (angle, decimals) {
    var value;

    if (!angle && angle !== 0) {
      return _empty;
    }

    if (typeof decimals === 'number') {
      value = Number(angle).toFixed(decimals);
    } else {
      value = Math.round(angle);
    }

    return value + '&deg;';
  };

  /**
   * Converts azimuth to a back azimuth (opposite direction).
   *
   * @param azimuth {Number}
   *    azimuth to format
   * @return {Number}
   *    formatted azimuth
   */
  _this.backAzimuth = function(azimuth) {
    if (azimuth >= 180) {
      azimuth = azimuth - 180;
    } else if (azimuth < 180) {
      azimuth = azimuth + 180;
    }

    return azimuth;
  };


  /**
   * Format a UTC date.
   *
   * @param date {Date}
   *        date to format.
   * @return {String}
   *         formatted date.
   */
  _this.date = function (date) {
    var year,
        month,
        day;

    if (!date || typeof date.getTime !== 'function') {
      return _empty;
    }

    year = date.getUTCFullYear();
    month = date.getUTCMonth() + 1;
    day = date.getUTCDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return year + '-' + month + '-' + day;
  };

  /**
   * Format a date and time.
   *
   * @param stamp {Date|Number}
   *        Date or millisecond epoch timstamp to format.
   * @param minutesOffset {Number}
   *        UTC offset in minutes.  0 for UTC.
   * @param includeMilliseconds {Boolean}
   *        default false.
   *        whether to output milliseconds.
   * @return {String}
   *         formatted date.
   */
  _this.datetime = function (stamp, minutesOffset, includeMilliseconds) {
    var milliOffset,
        date;

    if (!stamp && stamp !== 0) {
      return _empty;
    } else if (typeof stamp.getTime === 'function') {
      // allow Date objects
      stamp = stamp.getTime();
    }

    minutesOffset = minutesOffset || 0;
    milliOffset = minutesOffset * 60 * 1000;
    date = new Date(stamp + milliOffset);

    return _this.date(date) + ' ' + _this.time(date, includeMilliseconds) +
        ' (UTC' + _this.timezoneOffset(minutesOffset) + ')';
  };

  /**
   * Format a depth.
   *
   * @param depth {Number}
   *        depth to format
   * @param units {String}
   *        Optional.
   *        depth units, if any.
   * @param error {Number}
   *        Optional.
   *        depth error, if any.
   * @return {String} formatted string.
   */
  _this.depth = function (depth, units, error) {
    if (!depth && depth !== 0) {
      return _empty;
    }
    return _this.number(depth, _depthDecimals, _empty, units) +
        _this.uncertainty(error, _depthDecimals, '');
  };

  /**
   * Format a distance (like km or mi).
   *
   * @param distance {Number}
   *     The distance for format.
   * @param units {String}
   *     The units for this distance.
   *
   * @return {String}
   *     A formatted distance string.
   */
  _this.distance = function (distance, units) {
    return _this.number(distance, _distanceDecimals, _empty, units);
  };

  /**
   * Convert kilometers to miles.
   *
   * @param km {Number}
   *        kilometers.
   * @return {Number}
   *         miles.
   */
  _this.kmToMi = function (km) {
    if (!km) {
      return km;
    }
    return (km * _MILES_PER_KILOMETER);
  };

  /**
   * Format a latitude
   * @param latitude {Number}
   *        the latitude.
   * @return {String} formatted string.
   */
  _this.latitude = function (latitude) {
    var latDir;

    if (!latitude && latitude !== 0) {
      return _empty;
    }
    latDir = (latitude >= 0 ? 'N' : 'S');

    // already have sign information, abs before rounding
    latitude = Math.abs(latitude);

    // round to configured number of decimals
    if (typeof _locationDecimals === 'number') {
      latitude = latitude.toFixed(_locationDecimals);
    }

    return latitude + '&deg;' + latDir;
  };

  /**
   * Format a latitude and longitude.
   *
   * @param latitude {Number}
   *        the latitude.
   * @param longitude {Number}
   *        the longitude.
   * @return {String} formatted string.
   */
  _this.location = function (latitude, longitude) {
    return _this.latitude(latitude) + '&nbsp;' +
        _this.longitude(longitude);
  };

  /**
   * Format a longitude
   * @param longitude {Number}
   *        the longitude.
   * @return {String} formatted string.
   */
  _this.longitude = function (longitude) {
    var lonDir;

    if (!longitude && longitude !== 0) {
      return _empty;
    }
    lonDir = (longitude >= 0 ? 'E' : 'W');

    // already have sign information, abs before rounding
    longitude = Math.abs(longitude);

    // round to configured number of decimals
    if (typeof _locationDecimals === 'number') {
      longitude = longitude.toFixed(_locationDecimals);
    }

    return longitude + '&deg;' + lonDir;
  };

  /**
   * Format a magnitude.
   *
   * @param magnitude {Number}
   *        magnitude to format.
   * @param type {String}
   *        Optional.
   *        magnitude type.
   * @param error {Number}
   *        Optional.
   *        magnitude error.
   * @return {String} formatted string.
   */
  _this.magnitude = function (magnitude, type, error) {
    return _this.number(magnitude, _magnitudeDecimals, _empty, type) +
        _this.uncertainty(error, _magnitudeDecimals, '');
  };

  /**
   * Translate mmi to a roman numeral
   *
   * @params mmi {number}
   *         Modified Mercal Intensity
   * @params empty {string}
   *         The string to return if mmi is out of range
   *
   * @returns {string}
   *          The Roman Numeral cooresponding to the mmi.
   */
  _this.mmi = function (mmi, empty) {
    mmi = Math.round(mmi);

    return _MMI_ARRAY[mmi] || empty || _empty;
  };

  /**
   * Format a number.
   *
   * @param value {Number}
   *        number to format.
   * @param decimals {Number}
   *        Optional, default does not round.
   *        number of decimal places to round.
   * @param empty {Any}
   *        Optional, default none.
   *        value to return if value is empty.
   * @param units {String}
   *        Optional, default none.
   *        units of value.
   * @return {String} formatted string.
   */
  _this.number = function (value, decimals, empty, units) {
    if (!value && value !== 0) {
      return empty || _empty;
    }
    if (typeof decimals === 'number') {
      value = Number(value).toFixed(decimals);
    }
    if (units) {
      value += ' ' + units;
    }
    return value;
  };

  /**
   * Put commas into a number for display.
   *
   * @param x {Number}
   *        number to format.
   *
   * @param empty {Any}
   *        Optional, default none.
   *        value to return if value is empty.
   */
  _this.numberWithCommas = function (x, empty) {
    if (!x && x !== 0) {
      return empty || _empty;
    }

    var parts = x.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  };

  /**
   * Format a UTC time.
   *
   * @param date {Date}
   *        date to format.
   * @param includeMilliseconds {Boolean}
   *        default false.
   *        whether to output milliseconds.
   * @return {String}
   *         formatted time.
   */
  _this.time = function (date, includeMilliseconds) {
    var hours,
        minutes,
        seconds,
        milliseconds;

    if (!date || typeof date.getTime !== 'function') {
      return _empty;
    }

    hours = date.getUTCHours();
    minutes = date.getUTCMinutes();
    seconds = date.getUTCSeconds();
    milliseconds = '';

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (includeMilliseconds) {
      milliseconds = date.getUTCMilliseconds();
      if (milliseconds < 10) {
        milliseconds = '.00' + milliseconds;
      } else if (milliseconds < 100) {
        milliseconds = '.0' + milliseconds;
      } else {
        milliseconds = '.' + milliseconds;
      }
    }

    return hours + ':' + minutes + ':' + seconds + milliseconds;
  };

  /**
   * Formats time since a given time.
   *
   * @param time stamp {date}
   *    Date time to format.
   * @return {string}
   *    formatted time.
   */
  _this.timeSince = function (timeSince) {
    if (!timeSince) {
      return _empty;
    }

    var days,
        hrs,
        mins,
        secs,
        weeks;

    weeks = Math.floor(timeSince/604800);
    days = Math.floor(timeSince/86400) % 7;
    hrs = Math.floor(timeSince/3600) % 24;
    mins = Math.floor(timeSince/60) % 60;
    secs = timeSince % 60;

    timeSince =
      (weeks ? weeks + ' weeks, ' : '') +
      (days ? days + ' days, ' : '') +
      (hrs ? hrs + ':' : '') +
      (mins < 10 ? '0' + mins + ':' : mins + ':') +
      (secs < 10 ? '0' + secs : secs);

    return timeSince;
  };

  /**
   * Format a UTC timezone offset.
   *
   * @param offset {Number}
   *        UTC offset in minutes.  0 for UTC.
   * @return {String}
   *         formatted timezone offset, or '' when offset is 0.
   */
  _this.timezoneOffset = function (offset) {
    var hours,
        minutes,
        sign;

    if (!offset || offset === 0) {
      return '';
    } else if (offset < 0) {
      sign = '-';
      offset *= -1;
    } else {
      sign = '+';
    }

    hours = parseInt(offset / 60, 10);
    minutes = parseInt(offset % 60, 10);

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return sign + hours + ':' + minutes;
  };

  /**
   * Format an uncertainty.
   *
   * @param error {Number}
   *        uncertainty to format.
   * @param decimals {Number}
   *        Optional, default does not round.
   *        number of decimal places to round.
   * @param empty {Any}
   *        Optional, default none.
   *        value to return if error is empty.
   * @param units {String}
   *        Optional, default none.
   *        units of error.
   * @return {String} formatted string.
   */
  _this.uncertainty = function (error, decimals, empty, units) {
    if (!error && error !== 0) {
      return empty;
    }
    error = _this.number(error, decimals, null, units);
    return '<span class="uncertainty">&plusmn; ' + error + '</span>';
  };


  _initialize(options);
  options = null;
  return _this;
};


Formatter.MILES_PER_KILOMETER = _MILES_PER_KILOMETER;


module.exports = Formatter;
