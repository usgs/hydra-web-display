'use strict';


var BeachBallView = require('BeachBallView'),
    Collection = require('mvc/Collection'),
    Formatter = require('Formatter'),
    MagnitudeCollectionTable = require('MagnitudeCollectionTable'),
    Model = require('mvc/Model'),
    Tensor = require('Tensor'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {};


/**
* Displays moment summary information, including a MagnitudeCollectionView
*
* @param options {Object}
*
* @param options.collection {Collection}
*        A collection of magnitudes with the same type
* @param options.el {HTMLElement}
*        HTML element to attach the view
* @param options.ev {Model}
*        An event model object
* @param options.model {Model}
*        A Magnitude Model object
*/
var MagnitudeSummaryView = function (options) {

  var _this,
      _initialize,

      _collection,
      _ev,
      _formatter,
      _magnitudeCollectionView,
      _magnitudeVersionsEl;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    var el;

    _formatter = Formatter({
      empty: ''
    });
    _collection = options.collection || Collection();
    _ev = options.ev || Model();

    el = _this.el;
    el.innerHTML = [
      '<div class="magnitude-summary-view">',
        '<h3>Moment Summary</h3>',
        '<table><tbody class="magnitude-details"></tbody></table>',
        '<div class="magnitude-versions"></div>',
      '</div>'
    ].join('');

    _this.dataTableEl = el.querySelector('.magnitude-details');
    _this.dataTableEl.innerHTML = _this.buildMagnitudeDetailsMarkup();

    _this.displayBeachBall();

    _magnitudeVersionsEl = el.querySelector('.magnitude-versions');
    _magnitudeCollectionView = MagnitudeCollectionTable({
      el: _magnitudeVersionsEl,
      collection: _collection,
      model: _this.model
    });
    _magnitudeCollectionView.render();

    _this.timerCountUp(_ev.get('eventtime'));
  };

  _this.buildMagnitudeDetailsMarkup = function () {
    var associatedBy,
        azimuthalGap,
        comment,
        condition,
        depth,
        eventDepth,
        eventGeometry,
        eventLatitude,
        eventLongitude,
        eventMagnitude,
        eventRegion,
        eventTime,
        fit,
        inputSource,
        isInternal,
        isPreferred,
        isPublishable,
        latitude,
        longitude,
        magnitude,
        markup,
        moment,
        nodalPlane1,
        nodalPlane2,
        observations,
        percentDoubleCouple,
        source,
        sourceTimeDecay,
        sourceTimeDuration,
        sourceTimeRise,
        time,
        varianceReduction;

    // Event Details
    eventGeometry = _ev.get('geometry');
    if (eventGeometry) {
      eventDepth = _ev.get('geometry').coordinates[2];
      eventLatitude = _ev.get('geometry').coordinates[0];
      eventLongitude = _ev.get('geometry').coordinates[1];
    }
    eventMagnitude = _ev.get('magnitude') + ' ' + _ev.get('magnitudeType');
    eventRegion = _ev.get('title');
    eventTime = _ev.get('eventtime');

    // Magnitude Details
    associatedBy = _this.getProperty('associated-by-installation') + ' - ' +
        _this.getProperty('associated-by');
    azimuthalGap = _this.getProperty('azimuthal-gap');
    comment = _this.getProperty('comment');
    condition = _this.getProperty('condition');
    depth = _this.getProperty('derived-depth');
    fit = _this.getProperty('fit');
    inputSource = _this.getProperty('inputSource');
    isInternal = _this.getProperty('is-internal');
    isPreferred = _this.getProperty('is-preferred-for-type');
    isPublishable = _this.getProperty('is-publishable');
    latitude = _this.getProperty('derived-latitude');
    longitude = _this.getProperty('derived-longitude');
    magnitude = _this.getProperty('derived-magnitude') + ' ' +
        _this.getProperty('derived-magnitude-type');
    moment = _this.getProperty('scalar-moment');
    observations = _this.getProperty('num-stations-used') + ' (' +
        _this.getProperty('num-stations-associated') + ')';
    percentDoubleCouple = _this.getProperty('percent-double-couple');
    source = _this.getProperty('installation') + ' - ' +
        _this.getProperty('author');
    sourceTimeDecay = _this.getProperty('sourcetime-decaytime');
    sourceTimeDuration = _this.getProperty('sourcetime-duration');
    sourceTimeRise = _this.getProperty('sourcetime-risetime');
    time = _this.getProperty('derived-eventtime');
    varianceReduction = _this.getProperty('variance-reduction');
    nodalPlane1 = 'Strike: ' + _this.getProperty('nodal-plane-1-strike') +
        '&nbsp;&nbsp; Dip: ' + _this.getProperty('nodal-plane-1-dip') +
        '&nbsp;&nbsp; Rake: ' + _this.getProperty('nodal-plane-1-slip');
    nodalPlane2 = 'Strike: ' + _this.getProperty('nodal-plane-2-strike') +
        '&nbsp;&nbsp; Dip: ' + _this.getProperty('nodal-plane-2-dip') +
        '&nbsp;&nbsp; Rake: ' + _this.getProperty('nodal-plane-2-slip');

    // TODO, remove this
    var value = '<b>TODO</b>';

    markup =
      '<tr>' +
        '<th scope="row">Magnitude</th>' +
        '<td>' + magnitude + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Observations</th>' +
        '<td>' + observations + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Source</th>' +
        '<td>' + source + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Internal</th>' +
        '<td>' + isInternal + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Preferred For Type</th>' +
        '<td>' + isPreferred + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Publishable</th>' +
        '<td>' + isPublishable + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Associated By</th>' +
        '<td>' + associatedBy + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Comment</th>' +
        '<td>' + comment + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Moment</th>' +
        '<td>' + moment + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Solution Time</th>' +
        '<td>' + _formatter.datetime(Date.parse(time)) + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Solution Location</th>' +
        '<td>' + _formatter.location(latitude, longitude) + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Solution Depth</th>' +
        '<td>' + _formatter.distance(depth, 'km') + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Solution Method</th>' +
        '<td>' + value + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Fit</th>' +
        '<td>' + fit + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Variance Reduction</th>' +
        '<td>' + varianceReduction + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Percent Double Couple</th>' +
        '<td>' +
          _formatter.number(percentDoubleCouple * 100, 0, '', '%') +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Focal Mechanism</th>' +
        '<td class="beach-ball-view"></td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Nodal Plane 1</th>' +
        '<td>' + nodalPlane1 + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Nodal Plane 2</th>' +
        '<td>' + nodalPlane2 + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Percent CLVD</th>' +
        '<td>' +
          _formatter.number((1 - percentDoubleCouple) * 100, 0, '', '%') +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Source Time Decay</th>' +
        '<td>' + sourceTimeDecay + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Source Time Duration</th>' +
        '<td>' + sourceTimeDuration + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Source Time Rise</th>' +
        '<td>' + sourceTimeRise + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Input Source</th>' +
        '<td>' + inputSource + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Gap</th>' +
        '<td>' + azimuthalGap + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Condition #</th>' +
        '<td>' + condition + '</td>' +
      '</tr>';

    return markup;
  };

  _this.getProperty = function (key) {
    var properties;

    properties = _this.model.get('properties');
    if (properties && properties.hasOwnProperty(key)) {
      return properties[key];
    }
    return '';
  };

  _this.getTensor = function () {
    var tensor;

    tensor = Tensor.fromStrikeDipRake(
      Number(_this.getProperty('nodal-plane-1-strike')),
      Number(_this.getProperty('nodal-plane-1-dip')),
      Number(_this.getProperty('nodal-plane-1-rake') ||
          _this.getProperty('nodal-plane-1-slip') || 0),
      Number(_this.getProperty('scalar-moment') || Math.SQRT2)
    );

    return tensor;
  };

  _this.displayBeachBall = function () {
    var beachBallView,
        el;

    beachBallView = BeachBallView({
      fillColor: '#ccc',
      labelAxes: false,
      labelPlanes: false,
      size: 200,
      tensor: _this.getTensor()
    });
    beachBallView.render();

    el = _this.el.querySelector('.beach-ball-view');
    el.appendChild(beachBallView.el);
  };

  _this.timerCountUp = function (datetime) {
    var current,
        el,
        milliseconds,
        elapsed;

    el = _this.el.querySelector('.timer-count-up');

    try {
      current = new Date().getTime();
      milliseconds = Date.parse(datetime);
      elapsed = Math.floor((current - milliseconds) / 1000);
    } catch (e) {
      el.innerHTML = '';
      return;
    }

    window.setInterval(function () {
      var clock,
          days,
          hrs,
          mins,
          secs,
          weeks;

      elapsed++;
      weeks = Math.floor(elapsed/604800);
      days = Math.floor(elapsed/86400) % 7;
      hrs = Math.floor(elapsed/3600) % 24;
      mins = Math.floor(elapsed/60) % 60;
      secs = elapsed % 60;

      clock =
          (weeks ? weeks + ' weeks, ' : '') +
          (days ? days + ' days, ' : '') +
          (hrs ? hrs + ':' : '') +
          (mins ? mins + ':' : '') +
          (secs < 10 ? '0' + secs : secs);

      el.innerHTML = clock;
    }, 1000);
  };

  _this.destroy = Util.compose(function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeSummaryView;
