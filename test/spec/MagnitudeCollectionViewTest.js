/* global chai, describe, it */
'use strict';

var MagnitudeCollectionView = require('MagnitudeCollectionView');


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

});
