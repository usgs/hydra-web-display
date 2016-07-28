/* global chai, describe, it */
'use strict';

var MagnitudeTabView = require('MagnitudeTabView');

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
});
