/* global chai, describe, it */
'use strict';

var Formatter = require('Formatter');

var expect = chai.expect;


describe('Formatter', function () {
  var formatter,
      testDate;

  formatter = Formatter({
    depthDecimals: 2,
    empty: 'EMPTY',
    locationDecimals: 4,
    magnitudeDecimals: 5
  });

  testDate = new Date('2001-01-02T01:02:03.123Z');

  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof Formatter).to.equal('function');
    });
  });

  describe('angle', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.angle()).to.equal('EMPTY');
    });

    it('formats zero angle', function () {
      expect(formatter.angle(0)).to.equal('0&deg;');
    });

    it('rounds when no decimals specified', function () {
      expect(formatter.angle(1.2)).to.equal('1&deg;');
    });

    it('rounds to specified number of decimals', function () {
      expect(formatter.angle(1.2, 2)).to.equal('1.20&deg;');
    });
  });

  describe('backAzimuth', function () {
    it('returns correct backAzimuth 180 degrees returns 0 degrees',
        function () {
      expect(formatter.backAzimuth(180)).to.equal(0);
    });

    it('returns correct backAzimuth 0 degrees returns 180 degrees',
        function () {
      expect(formatter.backAzimuth(0)).to.equal(180);
    });

    it('returns correct backAzimuth 90 degrees returns 270 degrees',
        function () {
      expect(formatter.backAzimuth(90)).to.equal(270);
    });

    it('returns correct backAzimuth 270 degrees returns 90 degrees',
        function () {
      expect(formatter.backAzimuth(270)).to.equal(90);
    });
  });

  describe('date', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.date()).to.equal('EMPTY');
    });

    it('formats date as YYYY-MM-DD', function () {
      expect(formatter.date(testDate)).to.equal('2001-01-02');
    });
  });

  describe('datetime', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.datetime()).to.equal('EMPTY');
    });

    it('formats datetime', function () {
      expect(formatter.datetime(testDate)).to.equal(
          '2001-01-02 01:02:03 (UTC)');
    });

    it('includes milliseconds when requested', function () {
      expect(formatter.datetime(testDate, 0, true)).to.equal(
          '2001-01-02 01:02:03.123 (UTC)');
    });

    it('supports custom timezones', function () {
      expect(formatter.datetime(testDate, 75, true)).to.equal(
          '2001-01-02 02:17:03.123 (UTC+01:15)');
    });
  });

  describe('depth', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.depth()).to.equal('EMPTY');
    });

    it('formats depth', function () {
      expect(formatter.depth(1.234)).to.equal('1.23');
    });

    it('supports units', function () {
      expect(formatter.depth(1.234, 'nm')).to.equal('1.23 nm');
    });

    it('supports uncertainty', function () {
      expect(formatter.depth(1.234, 'nm', 0.12)).to.equal(
          '1.23 nm<span class="uncertainty">&plusmn; 0.12</span>');
    });
  });

  describe('kmToMi', function () {
    expect(formatter.kmToMi(1).toFixed(3)).to.equal('0.621');
  });

  describe('latitude', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.latitude()).to.equal('EMPTY');
    });

    it('formats direction', function () {
      expect(formatter.latitude(1.2)).to.equal('1.2000&deg;N');
      expect(formatter.latitude(-1.2)).to.equal('1.2000&deg;S');
    });
  });

  describe('location', function () {
    it('formats as expected', function () {
      expect(formatter.location(1.23, 2.34)).to.equal(
      formatter.latitude(1.23) + '&nbsp;' +
      formatter.longitude(2.34));
    });
  });

  describe('longitude', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.longitude()).to.equal('EMPTY');
    });

    it('formats direction', function () {
      expect(formatter.longitude(1.2)).to.equal('1.2000&deg;E');
      expect(formatter.longitude(-1.2)).to.equal('1.2000&deg;W');
    });
  });

  describe('magnitude', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.magnitude()).to.equal('EMPTY');
    });

    it('formats depth', function () {
      expect(formatter.magnitude(1.234)).to.equal('1.23400');
    });

    it('supports units', function () {
      expect(formatter.magnitude(1.234, 'type')).to.equal('1.23400 type');
    });

    it('supports uncertainty', function () {
      expect(formatter.magnitude(1.234, 'type', 0.12)).to.equal(
          '1.23400 type<span class="uncertainty">&plusmn; 0.12000</span>');
    });
  });

  describe('mmi', function () {
    it('returns a roman Numeral', function () {
      expect(formatter.mmi(1.4, '-')).to.equal('I');
    });
    it('returns the empty value', function () {
      expect(formatter.mmi(-1,'n')).to.equal('n');
    });
  });

  describe('number', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.number(null, 1, 'empty')).to.equal('empty');
    });

    it('returns EMPTY value when undefined and empty value is not passed',
        function () {
      expect(formatter.number(null, 1)).to.equal('EMPTY');
    });

    it('uses decimals to round', function () {
      expect(formatter.number(1.2366, 3)).to.equal('1.237');
    });

    it('supports units', function () {
      expect(formatter.number(1, 0, 'empty', 'units')).to.equal('1 units');
    });
  });

  describe('numberWithCommas', function () {
    it('returns passed empty value when x is null', function () {
      expect(formatter.numberWithCommas(null, 'emptyValue')).
          to.equal('emptyValue');
    });

    it('returns EMPTY when x is null and empty value is not passed',
        function () {
      expect(formatter.numberWithCommas(null)).to.equal('EMPTY');
    });

    it('returns number correctly formatted', function () {
      expect(formatter.numberWithCommas(30000)).to.equal('30,000');
    });

    it('returns EMPTY when no x value is passed', function () {
      expect(formatter.numberWithCommas()).to.equal('EMPTY');
    });
  });

  describe('time', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.time()).to.equal('EMPTY');
    });

    it('formats time', function () {
      expect(formatter.time(testDate)).to.equal(
          '01:02:03');
    });

    it('includes milliseconds when requested', function () {
      expect(formatter.time(testDate, true)).to.equal(
          '01:02:03.123');
    });
  });

  describe('timeSince', function () {
    it('returns empth value when undefined', function () {
      expect(formatter.timeSince()).to.equal('EMPTY');
    });

    it('formats time correctly', function () {
      expect(formatter.timeSince(testDate)).
          to.equal('1617720 weeks, 3 days, 2:12:03');
    });
  });

  describe('timezoneOffset', function () {
    it('returns empty string when undefined', function () {
      expect(formatter.timezoneOffset()).to.equal('');
    });

    it('supports positive values', function () {
      expect(formatter.timezoneOffset(123)).to.equal('+02:03');
    });

    it('supports negative values', function () {
      expect(formatter.timezoneOffset(-123)).to.equal('-02:03');
    });
  });

  describe('uncertainty', function () {
    it('returns empty value when undefined', function () {
      expect(formatter.uncertainty(null, 1, 'empty')).to.equal('empty');
    });

    it('uses decimals to round', function () {
      expect(formatter.uncertainty(1.2366, 3)).to.equal(
          '<span class="uncertainty">&plusmn; 1.237</span>');
    });

    it('supports units', function () {
      expect(formatter.uncertainty(1.2366, 3, 'empty', 'units')).to.equal(
          '<span class="uncertainty">&plusmn; 1.237 units</span>');
    });
  });

});
