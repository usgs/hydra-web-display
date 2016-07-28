/* global before, chai, describe, it, sinon */
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

  describe('beginTimeSinceCounter', function () {
    it('calls updateTimeSince', function () {
      var spy,
          time,
          view;

      time = '2016-07-19T05:18:38.58Z';
      view = EventSummaryView();
      spy = sinon.spy(view, 'updateTimeSince');

      view.beginTimeSinceCounter(time);
      expect(spy.callCount).to.equal(1);

      spy.restore();
      view.destroy();
    });
  });

  describe('updateTimeSince', function () {
    it('returns correct time', function () {
      var time,
          view;


      view = EventSummaryView();
      time = '2016-07-19T05:18:38.58Z';


      view.updateTimeSince(time);
      expect(view.el.querySelector('.timer-count-up').innerHTML).
          to.not.equal(null);

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

      expect(view.el.querySelector('#event-summary-origin-time').innerHTML).
          to.equal('2016-07-19T05:18:38.58Z');
      expect(view.el.querySelector('#event-summary-latitude').innerHTML).
          to.equal('30.172°S');
      expect(view.el.querySelector('#event-summary-longitude').innerHTML).
          to.equal('72.156°W');
      expect(view.el.querySelector('#event-summary-depth').innerHTML).
          to.equal('5.1 km');
      expect(view.el.querySelector('#event-summary-magnitude').innerHTML).
          to.equal('5.2 Ms_20');

      view.destroy();
    });
  });
});
