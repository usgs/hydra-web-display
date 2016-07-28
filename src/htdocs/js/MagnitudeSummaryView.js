'use strict';


var BeachballView = require('BeachBallView'),
    Collection = require('mvc/Collection'),
    EventModel = require('EventModel'),
    Formatter = require('Formatter'),
    MagnitudeCollectionTable = require('MagnitudeCollectionTable'),
    MagnitudeModel = require('MagnitudeModel'),
    Tensor = require('Tensor'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  renderNow: false // should view render initially during construction
};


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

      _createViewScaffold;


  options = Util.extend({model: MagnitudeModel()}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    _this.formatter = options.formatter || Formatter({empty: ''});
    _this.event = options.event || EventModel();
    _this.magnitudes = Collection();

    _createViewScaffold();

    _this.magnitudesTable = MagnitudeCollectionTable({
      el: _this.magnitudesEl,
      collection: _this.magnitudes,
      model: _this.model
    });

    if (options.renderNow) {
      _this.render();
    }
  };


  _createViewScaffold = function () {
    var el;

    el = _this.el;

    el.innerHTML = [
      '<div class="magnitude-summary-view">',
        '<h3>Moment Summary</h3>',
        '<table>',
          '<tbody class="magnitude-details">','<tr>',
            '<th scope="row">Magnitude</th>',
            '<td class="magnitude-derived-magnitude"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Observations</th>',
            '<td class="magnitude-observations"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Source</th>',
            '<td class="magnitude-source"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Internal</th>',
            '<td class="magnitude-is-internal"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Preferred For Type</th>',
            '<td class="magnitude-is-preferred"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Publishable</th>',
            '<td class="magnitude-is-publishable"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Associated By</th>',
            '<td class="magnitude-associated-by"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Comment</th>',
            '<td class="magnitude-comment"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Moment</th>',
            '<td class="magnitude-moment"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Solution Time</th>',
            '<td class="magnitude-solution-time"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Solution Location</th>',
            '<td class="magnitude-solution-location"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Solution Depth</th>',
            '<td class="magnitude-solution-depth"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Solution Method</th>',
            '<td class="magnitude-solution-method"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Fit</th>',
            '<td class="magnitude-fit"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Variance Reduction</th>',
            '<td class="magnitude-variance-reduction"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Percent Double Couple</th>',
            '<td class="magnitude-percent-double-couple"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Focal Mechanism</th>',
            '<td class="magnitude-beachball"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Nodal Plane 1</th>',
            '<td class="magnitude-nodal-plane-1"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Nodal Plane 2</th>',
            '<td class="magnitude-nodal-plane-2"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Percent CLVD</th>',
            '<td class="magnitude-percent-clvd"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Source Time Decay</th>',
            '<td class="magnitude-sourcetime-decay"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Source Time Duration</th>',
            '<td class="magnitude-sourcetime-duration"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Source Time Rise</th>',
            '<td class="magnitude-sourcetime-risetime"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Input Source</th>',
            '<td class="magnitude-input-source"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Gap</th>',
            '<td class="magnitude-azimuthal-gap"></td>',
          '</tr>',
          '<tr>',
            '<th scope="row">Condition #</th>',
            '<td class="magnitude-condition"></td>',
          '</tr>',
          '</tbody>',
        '</table>',
        '<div class="magnitude-versions"></div>',
      '</div>'
    ].join('');

    _this.derivedMagnitudeEl = el.querySelector('.magnitude-derived-magnitude');
    _this.observationsEl = el.querySelector('.magnitude-observations');
    _this.sourceEl = el.querySelector('.magnitude-source');
    _this.internalEl = el.querySelector('.magnitude-is-internal');
    _this.preferredEl = el.querySelector('.magnitude-is-preferred');
    _this.publishableEl = el.querySelector('.magnitude-is-publishable');
    _this.associatedByEl = el.querySelector('.magnitude-associated-by');
    _this.commentEl = el.querySelector('.magnitude-comment');
    _this.momentEl = el.querySelector('.magnitude-moment');
    _this.solutionTimeEl = el.querySelector('.magnitude-solution-time');
    _this.solutionLocationEl = el.querySelector('.magnitude-solution-location');
    _this.solutionDepthEl = el.querySelector('.magnitude-solution-depth');
    _this.solutionMethodEl = el.querySelector('.magnitude-solution-method');
    _this.fitEl = el.querySelector('.magnitude-fit');
    _this.varianceEl = el.querySelector('.magnitude-variance-reduction');
    _this.percentDcEl = el.querySelector('.magnitude-percent-double-couple');
    _this.beachballEl = el.querySelector('.magnitude-beachball');
    _this.np1El = el.querySelector('.magnitude-nodal-plane-1');
    _this.np2El = el.querySelector('.magnitude-nodal-plane-2');
    _this.clvdEl = el.querySelector('.magnitude-percent-clvd');
    _this.decayEl = el.querySelector('.magnitude-sourcetime-decay');
    _this.durationEl = el.querySelector('.magnitude-sourcetime-duration');
    _this.riseEl = el.querySelector('.magnitude-sourcetime-risetime');
    _this.inputSourceEl = el.querySelector('.magnitude-input-source');
    _this.azimuthalGapEl = el.querySelector('.magnitude-azimuthal-gap');
    _this.conditionEl = el.querySelector('.magnitude-condition');

    _this.magnitudesEl = el.querySelector('.magnitude-versions');
  };


  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    if (_this.magnitudesTable) {
      _this.magnitudesTable.destroy();
      _this.magnitudesTable = null;
    }

    if (_this.magnitudes) {
      _this.magnitudes.destroy();
      _this.magnitudes = null;
    }

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
    var mt,
        tensor;

    mt = _this.model.get('moment-tensors')[0] || {};

    tensor = Tensor({
      mtt: mt['tensor-mtt'],
      mpp: mt['tensor-mpp'],
      mrr: mt['tensor-mrr'],
      mrt: mt['tensor-mrt'],
      mrp: mt['tensor-mrp'],
      mtp: mt['tensor-mtp']
    });

    return tensor;
  };

_this.render = function () {
    var markup,
        mt;

    // TODO, remove this
    var TODO = '<b>TODO</b>';

    mt = _this.model.get('moment-tensors')[0] || {};

    _this.derivedMagnitudeEl.innerHTML = [
      _this.model.get('derived-magnitude'), ' ',
      _this.model.get('derived-magnitude-type')
    ].join('');

    _this.observationsEl.innerHTML = [
      _this.model.get('num-stations-used'), ' ',
      '(', _this.model.get('num-stations-associated'), ')'
    ].join('');

    _this.sourceEl.innerHTML = [
      _this.model.get('installation'), ' - ', _this.model.get('author')
    ].join('');

    _this.internalEl.innerHTML = _this.model.get('is-internal');
    _this.preferredEl.innerHTML = _this.model.get('is-preferred');
    _this.publishableEl.innerHTML = _this.model.get('is-preferred');

    _this.associatedByEl.innerHTML = [
      _this.model.get('associated-by-installation'), ' - ',
      _this.model.get('associated-by')
    ].join('');

    _this.commentEl.innerHTML = _this.model.get('comment');


    _this.momentEl.innerHTML = [
      (mt['scalar-moment'].toExponential(3)).toUpperCase(),
      ' N-m'
    ].join('');

    _this.solutionTimeEl.innerHTML =
          _this.formatter.datetime(Date.parse(mt['derived-eventtime']));

    _this.solutionLocationEl.innerHTML = _this.formatter.location(
        mt['derived-latitude'], mt['derived-longitude']);
    _this.solutionDepthEl.innerHTML =
        _this.formatter.depth(mt['derived-depth'], 'km');

    _this.solutionMethodEl.innerHTML = TODO;
    _this.fitEl.innerHTML = mt.fit;
    _this.varianceEl.innerHTML = mt['variance-reduction'];
    _this.percentDcEl.innerHTML = _this.formatter.number(
        mt['percent-double-couple'] * 100, 0, '', '%');

    _this.np1El.innerHTML = [
      'Strike: ', mt['nodal-plane-1-strike'], '&nbsp',
      'Dip: ', mt['nodal-plane-1-dip'], '&nbsp',
      'Rake: ', mt['nodal-plane-1-slip']
    ].join('');

    _this.np2El.innerHTML = [
      'Strike: ', mt['nodal-plane-2-strike'], '&nbsp',
      'Dip: ', mt['nodal-plane-2-dip'], '&nbsp',
      'Rake: ', mt['nodal-plane-2-slip']
    ].join('');

    _this.clvdEl.innerHTML = _this.formatter.number(
        (1 - mt['percent-double-couple']) * 100, 0, '', '%');

    _this.decayEl.innerHTML = mt['sourcetime-decaytime'];
    _this.durationEl.innerHTML = mt['sourcetime-duration'];
    _this.riseEl.innerHTML = mt['sourcetime-risetime'];

    _this.inputSourceEl.innerHTML = TODO;
    _this.azimuthalGapEl.innerHTML = mt['azimuthal-gap'];
    _this.conditionEl.innerHTML = mt.condition;

    _this.renderBeachball();
    _this.renderMagnitudeTable();

    return markup;
  };

  _this.renderBeachball = function () {
    var beachballView;

    beachballView = BeachballView({
      fillColor: '#ccc',
      labelAxes: false,
      labelPlanes: false,
      size: 200,
      tensor: _this.getTensor()
    });

    beachballView.render();
    _this.beachballEl.appendChild(beachballView.el);

    beachballView.destroy();
  };

  _this.renderMagnitudeTable = function () {
    var type,
        magnitudes;

    type = _this.model.get('derived-magnitude-type');
    magnitudes = _this.event.get('magnitudes').filter(function (magnitude) {
      return type === magnitude.type;
    });

    // resetting the collection will cause the view to render
    _this.magnitudes.reset(magnitudes);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MagnitudeSummaryView;
