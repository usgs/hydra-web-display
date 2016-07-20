/* global chai, describe, it, sinon */
'use strict';

var Collection = require('mvc/Collection'),
    MagnitudeCollectionView = require('MagnitudeCollectionView');


var expect = chai.expect;


describe('MagnitudeCollectionView', function () {

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof MagnitudeCollectionView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(MagnitudeCollectionView).to.not.throw(Error);
    });
  });

  describe('destroy', function () {
    it('can be destroyed', function () {
      var view;

      view = MagnitudeCollectionView();
      expect(view.destroy).to.not.throw(Error);
    });
  });

  describe('onSelect', function () {
    it ('calls onSelect with the selected collection item', function () {
      var collection,
          item,
          spy,
          view;

      item = {'id': 1};
      collection = Collection();
      collection.add(item);
      view = MagnitudeCollectionView({
        el: document.createElement('div'),
        collection: collection
      });
      spy = sinon.spy(view, 'onSelect');

      expect(spy.callCount).to.equal(0);

      collection.select(item);

      expect(spy.callCount).to.equal(1);
      expect(spy.calledWith(item)).to.equal(true);
    });
  });

});
