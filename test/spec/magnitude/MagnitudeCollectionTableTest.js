/* global chai, describe, it */
'use strict';

var MagnitudeCollectionTable = require('MagnitudeCollectionTable');


var expect = chai.expect;


describe('MagnitudeCollectionTable', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof MagnitudeCollectionTable).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(MagnitudeCollectionTable).to.not.throw(Error);
    });
  });

  describe('destroy', function () {
    it('can be destroyed', function () {
      var view;

      view = MagnitudeCollectionTable();
      expect(view.destroy).to.not.throw(Error);
    });
  });
});
