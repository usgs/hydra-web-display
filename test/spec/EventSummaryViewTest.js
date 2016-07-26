/* global before, chai, describe, it */
'use strict';

var EventSummaryView = require('EventSummaryView'),
    EventModel = require('EventModel'),
    Xhr = require('util/Xhr');

var expect = chai.expect;


describe('EventSummaryView', function () {
  var model;

  before(function (done) {
    Xhr.ajax({
      url: 'event.json',
      success: function (data) {
        model = EventModel.fromFeature(data);
        done();
      }
    });

  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof EventSummaryView).to.equal('function');
    });

    it('can be destroyed', function () {
      var view;

      view = EventSummaryView();
      expect(view.destroy).to.not.throw(Error);

      view.destroy();
    });
  });

  describe('render', function () {
    it('renders correctly', function () {
      var view;

      view = EventSummaryView({
        model: model
      });

      view.render();

      expect(view.el.querySelector('.origin-time').innerHTML).
          to.equal('<b>OT:</b> 2016-07-19T05:18:38.58Z');
      expect(view.el.querySelector('.latitude').innerHTML).
          to.equal('<b>Lat:</b> 30.172°S');
      expect(view.el.querySelector('.longitude').innerHTML).
          to.equal('<b>Lon:</b> 72.156°W');
      expect(view.el.querySelector('.depth').innerHTML).
          to.equal('<b>Depth:</b> 5.1 km');
      expect(view.el.querySelector('.magnitude').innerHTML).
          to.equal('<b>Mag:</b> 5.2 Ms_20');

      view.destroy();
    });
  });
});
