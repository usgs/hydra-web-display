/* global after, afterEach, before, beforeEach, chai, describe, it, sinon */
'use strict';


var EventSearchView = require('EventSearchView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');


var expect = chai.expect;


describe('EventSearchView', function () {
  var EVENT_DETAILS;

  before(function (done) {
    Xhr.ajax({
      url: 'event.json',
      success: function (data) {
        EVENT_DETAILS = data;
        sinon.stub(Xhr, 'ajax', function () {
          return data;
        });
      },
      done: function () {
        done();
      }
    });
  });

  after(function () {
    Xhr.ajax.restore();
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof EventSearchView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(EventSearchView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;

      view = EventSearchView();

      expect(view.destroy).to.not.throw(Error);

      view.destroy();
    });
  });

  describe('onHuidKeyUp', function () {
    var evt,
        view;

    beforeEach(function () {
      view = EventSearchView();
      sinon.spy(view, 'search');
      evt = {
        keyCode: null,
        which: null,
        preventDefault: sinon.spy()
      };
    });

    afterEach(function () {
      view.search.restore();
      view.destroy();

      evt = null;
      view = null;
    });

    it('does nothing if not the enter key', function () {
      evt.keyCode = 0;

      view.onHuidKeyUp(evt);

      expect(view.search.callCount).to.equal(0);
      expect(evt.preventDefault.callCount).to.equal(0);
    });

    it('behaves as expected if the enter key', function () {
      evt.keyCode = 13; // "Enter" key

      view.onHuidKeyUp(evt);

      expect(view.search.callCount).to.equal(1);
      expect(evt.preventDefault.callCount).to.equal(1);
    });
  });

  describe('onMagnitudeSelect', function () {
    var view;

    beforeEach(function () {
      view = EventSearchView();
      sinon.stub(view, 'openMagnitudeDisplay', function () {});
      sinon.stub(view.magnitudeCollection, 'getSelected',
          function () { return {}; });
    });

    afterEach(function () {
      view.magnitudeCollection.getSelected.restore();
      view.openMagnitudeDisplay.restore();
      view.destroy();
    });

    it('checks the selected magnitude', function () {
      view.onMagnitudeSelect();

      expect(view.magnitudeCollection.getSelected.callCount).to.equal(1);
    });

    it('calls open magnitude display', function () {
      view.onMagnitudeSelect();

      expect(view.openMagnitudeDisplay.callCount).to.equal(1);
    });
  });

  describe('onSearchClick', function () {
    it('calls search method', function () {
      var view;

      view = EventSearchView();

      sinon.spy(view, 'search');

      view.onSearchClick();
      expect(view.search.callCount).to.equal(1);

      view.search.restore();
      view.destroy();
    });
  });

  describe('openMagnitudeDisplay', function () {
    it('opens the display correctly', function () {
      var magnitude,
          url,
          view;

      view = EventSearchView({
        event: Model({id: 'huid'}),
        magnitudeUrl: 'magnitudeUrl'
      });

      magnitude = {
        author: 'author',
        installation: 'installation',
        type: 'type'
      };

      url = 'magnitudeUrl#?huid=huid&author=author&' +
          'installation=installation&type=type';

      sinon.stub(window, 'open', function () {});

      view.openMagnitudeDisplay(magnitude);

      expect(window.open.callCount).to.equal(1);
      expect(window.open.calledWith(url, 'hydra-magnitude-display'))
          .to.equal(true);

      window.open.restore();
      view.destroy();
    });
  });
});
