/* global chai, describe, it, sinon */
'use strict';


var MagnitudeTabView = require('magnitude/MagnitudeTabView');


var expect = chai.expect;


describe('MagnitudeTabView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof MagnitudeTabView).to.equal('function');
    });

    it('can be destroyed', function () {
      var view;

      view = MagnitudeTabView();
      expect(view.destroy).to.not.throw(Error);

      view.destroy();
    });
  });

  describe('_addTab', function () {
    it('destroys a previous view when a duplicate', function () {
      var spy,
          tab,
          tabView;

      tab = {
        id: 'example'
      };

      tabView = MagnitudeTabView({tabs: [tab]});
      spy = sinon.spy(tabView.views.example, 'destroy');

      tabView._addTab(tab);

      expect(spy.callCount).to.equal(1);

      spy.restore();
      tabView.destroy();
    });

    it('re-uses the existing tab if exists', function () {
      var tab,
          tabView;

      tab = {
        id: 'example'
      };

      tabView = MagnitudeTabView({tabs: [tab]});
      sinon.spy(tabView.tabList, 'addTab');

      tabView._addTab(tab);

      // Does not call addTab because re-using existing tab ...
      expect(tabView.tabList.addTab.callCount).to.equal(0);

      tabView.tabList.addTab.restore();
      tabView.destroy();
    });

    it('adds a new tab when appropriate', function () {
      var tab,
          tabView;

      tab = {
        id: 'example'
      };

      tabView = MagnitudeTabView({tabs: []}); // No default tabs ...
      sinon.spy(tabView.tabList, 'addTab');

      tabView._addTab(tab);

      // New tab, so should have called tabList.addTab method  ...
      expect(tabView.tabList.addTab.callCount).to.equal(1);

      tabView.tabList.addTab.restore();
      tabView.destroy();
    });
  });
});
