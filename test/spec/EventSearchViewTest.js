/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';


var EventSearchView = require('EventSearchView');


var expect = chai.expect;


describe('EventSearchView', function () {
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
});
