/* global after, before, chai, describe, it, sinon */
'use strict';


var Events = require('util/Events'),
    MagnitudeDisplay = require('magnitude/MagnitudeDisplay'),
    Xhr = require('util/Xhr');


var expect = chai.expect;


describe('MagnitudeDisplay', function () {
  after(function () {
    Xhr.ajax.restore();
  });

  before(function () {
    sinon.stub(Xhr, 'ajax', function () {
      return {
        data: {},
        metadata: {}
      };
    });
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof MagnitudeDisplay).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(MagnitudeDisplay).to.not.throw(Error);
    });

    it('binds to hashchange event', function () {
      var display,
          spy;

      spy = sinon.spy(Events, 'on');
      display = MagnitudeDisplay();

      expect(spy.callCount).to.equal(1);

      display.destroy();
    });
  });

  describe('destroy', function () {
    it('can be destroyed', function () {
      expect(function () {
        var display;

        display = MagnitudeDisplay();
        display.destroy();
        display.destroy(); // Do it twice to ensure it is safe to do so ...

        display = null;
      }).to.not.throw(Error);
    });
  });

  describe('fetch', function () {
    it('calls both fetch sub-methods', function () {
      var display;

      display = MagnitudeDisplay();
      sinon.stub(display, 'fetchEventSummary', function () {});
      sinon.stub(display, 'fetchMagnitudeDetails', function () {});

      display.fetch();

      expect(display.fetchEventSummary.callCount).to.equal(1);
      expect(display.fetchMagnitudeDetails.callCount).to.equal(1);

      display.fetchEventSummary.restore();
      display.fetchMagnitudeDetails.restore();
      display.destroy();
    });
  });

  describe('fetchEventSummary', function () {
    it('executes an ajax call', function () {
      var display;

      display = MagnitudeDisplay();
      Xhr.ajax.reset(); // Like we just made the spy, no calls yet ...

      display.fetchEventSummary();
      expect(Xhr.ajax.callCount).to.equal(1);

      display.destroy();
    });
  });

  describe('fetchMagnitudeDetails', function () {
    it('executes an ajax call', function () {
      var display;

      display = MagnitudeDisplay();
      Xhr.ajax.reset(); // Like we just made the spy, no calls yet ...

      display.fetchMagnitudeDetails();
      expect(Xhr.ajax.callCount).to.equal(1);

      display.destroy();
    });
  });

  describe('onEventWsError', function () {
    it('shows a message', function () {
      var display;

      display = MagnitudeDisplay();

      display.onEventWsError('example error');

      expect(display.errorsEl.childNodes.length).to.equal(1);
      expect(display.errorsEl.firstChild.firstChild.textContent)
          .to.equal('example error');

      display.destroy();
    });
  });

  describe('onEventWsSuccess', function () {
    it('resets the event model', function () {
      var display;

      display = MagnitudeDisplay();
      sinon.stub(display.eventModel, 'reset', function () {});

      display.onEventWsSuccess();

      expect(display.eventModel.reset.callCount).to.equal(1);

      display.eventModel.reset.restore();
      display.destroy();
    });
  });

  describe('onMagnitudeWsError', function () {
    it('shows a message', function () {
      var display;

      display = MagnitudeDisplay();

      display.onMagnitudeWsError('example error');

      expect(display.errorsEl.childNodes.length).to.equal(1);
      expect(display.errorsEl.firstChild.firstChild.textContent)
          .to.equal('example error');

      display.destroy();
    });
  });

  describe('onMagnitudeWsSuccess', function () {
    it('resets the magnitude model', function () {
      var display;

      display = MagnitudeDisplay();
      sinon.stub(display.magnitudeModel, 'reset', function () {});

      display.onMagnitudeWsSuccess();

      expect(display.magnitudeModel.reset.callCount).to.equal(1);

      display.magnitudeModel.reset.restore();
      display.destroy();
    });
  });

  describe('parseUrlParams', function () {
    it('gets all the expected parameters and no extra', function () {
      var display,
          expected,
          result,
          url;

      display = MagnitudeDisplay();

      url = '?huid=huid&foo=foo&author=author&installation=installation' +
          '&bar=bar&type=type';

      expected = {
        huid: 'huid',
        author: 'author',
        installation: 'installation',
        type: 'type'
      };

      result = display.parseUrlParams(url);

      expect(result).to.deep.equal(expected);
      expect(result.hasOwnProperty('foo')).to.equal(false);
      expect(result.hasOwnProperty('bar')).to.equal(false);

      display.destroy();
    });
  });
});
