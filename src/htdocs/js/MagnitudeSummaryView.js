'use strict';


var BeachBallView = require('BeachBallView'),
    Collection = require('mvc/Collection'),
    Formatter = require('Formatter'),
    MagnitudeCollectionTable = require('MagnitudeCollectionTable'),
    MagnitudeModel = require('MagnitudeModel'),
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
      _initialize;


  options = Util.extend({model: MagnitudeModel()}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    var el;

    _this.formatter = options.formatter || Formatter({empty: ''});
    _this.collection = options.collection || Collection([]);

    el = _this.el;
    el.innerHTML = [
      '<div class="magnitude-summary-view">',
        '<h3>Moment Summary</h3>',
        '<table><tbody class="magnitude-details"></tbody></table>',
        '<div class="magnitude-versions"></div>',
      '</div>'
    ].join('');

    _this.dataTableEl = el.querySelector('.magnitude-details');
    _this.dataTableEl.innerHTML = _this.render();

    _this.displayBeachBall();

    _this.magnitudesEl = el.querySelector('.magnitude-versions');
    _this.magnitudesTable = MagnitudeCollectionTable({
      el: _this.magnitudesEl,
      collection: _this.collection,
      model: _this.model
    });
    _this.magnitudesTable.render();
  };


  _this.render = function () {
    var markup,
        mt;

    // TODO, remove this
    var TODO = '<b>TODO</b>';

    mt = _this.model.get('moment-tensors')[0] || {};

    markup = [
      '<tr>',
        '<th scope="row">Magnitude</th>',
        '<td>',
          _this.model.get('derived-magnitude'), ' ',
          _this.model.get('derived-magnitude-type'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Observations</th>',
        '<td>',
          _this.model.get('num-stations-used'), ' ',
          '(', _this.model.get('num-stations-associated'), ')',
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Source</th>',
        '<td>',
          _this.model.get('installation'), ' - ', _this.model.get('author'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Internal</th>',
        '<td>',
          _this.model.get('is-internal'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Preferred For Type</th>',
        '<td>',
          _this.model.get('is-preferred'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Publishable</th>',
        '<td>',
          _this.model.get('is-preferred'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Associated By</th>',
        '<td>',
          _this.model.get('associated-by-installation'), ' - ',
          _this.model.get('associated-by'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Comment</th>',
        '<td>', _this.model.get('comment'), '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Moment</th>',
        '<td>', mt['scalar-moment'], '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Solution Time</th>',
        '<td>',
          _this.formatter.datetime(Date.parse(mt['derived-eventtime'])),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Solution Location</th>',
        '<td>',
          _this.formatter.location(mt['derived-latitude'],
              mt['derived-longitude']),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Solution Depth</th>',
        '<td>', _this.formatter.depth(mt['derived-depth'], 'km'), '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Solution Method</th>',
        '<td>', TODO, '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Fit</th>',
        '<td>', mt.fit, '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Variance Reduction</th>',
        '<td>', mt['variance-reduction'], '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Percent Double Couple</th>',
        '<td>',
          _this.formatter.number(mt['percent-double-couple'] * 100, 0,
              '', '%'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Focal Mechanism</th>',
        '<td class="beach-ball-view"></td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Nodal Plane 1</th>',
        '<td>',
          'Strike: ', mt['nodal-plane-1-strike'], '&nbsp',
          'Dip: ', mt['nodal-plane-1-dip'], '&nbsp',
          'Rake: ', mt['nodal-plane-1-slip'],
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Nodal Plane 2</th>',
        '<td>',
          'Strike: ', mt['nodal-plane-2-strike'], '&nbsp',
          'Dip: ', mt['nodal-plane-2-dip'], '&nbsp',
          'Rake: ', mt['nodal-plane-2-slip'],
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Percent CLVD</th>',
        '<td>',
          _this.formatter.number((1 - mt['percent-double-couple']) * 100, 0,
              '', '%'),
        '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Source Time Decay</th>',
        '<td>', mt['sourcetime-decaytime'], '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Source Time Duration</th>',
        '<td>', mt['sourcetime-duration'], '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Source Time Rise</th>',
        '<td>', mt['sourcetime-risetime'], '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Input Source</th>',
        '<td>', TODO, '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Gap</th>',
        '<td>', mt['azimuthal-gap'], '</td>',
      '</tr>',
      '<tr>',
        '<th scope="row">Condition #</th>',
        '<td>', mt.condition, '</td>',
      '</tr>'
    ].join('');

    return markup;
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

  _this.destroy = Util.compose(function () {
    _this.formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

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


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeSummaryView;
