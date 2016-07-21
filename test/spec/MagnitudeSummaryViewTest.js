/* global chai, describe, it */
'use strict';

var MagnitudeSummaryView = require('MagnitudeSummaryView');


var expect = chai.expect;


describe('MagnitudeSummaryView', function () {

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof MagnitudeSummaryView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(MagnitudeSummaryView).to.not.throw(Error);
    });
  });

  describe('destroy', function () {
    it('can be destroyed', function () {
      var view;

      view = MagnitudeSummaryView();
      expect(view.destroy).to.not.throw(Error);
    });
  });

});
