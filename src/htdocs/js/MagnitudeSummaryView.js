'use strict';


var BeachBallView = require('BeachBallView'),
    Collection = require('mvc/Collection'),
    Formatter = require('Formatter'),
    MagnitudeCollectionView = require('MagnitudeCollectionView'),
    Tensor = require('Tensor'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {};


var MagnitudeSummaryView = function (options) {

  var _this,
      _initialize,

      _collection,
      _formatter,
      _magnitudeCollectionView,
      _magnitudeDetailsEl,
      _magnitudeVersionsEl,
      _tensor;

  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    var el,
        type;

    _formatter = Formatter({
      empty: ''
    });
    _collection = options.collection || Collection();

    type = _this.getProperty('derived-magnitude-type');
    type = (!type ? _this.getProperty('beachball-type') : '');
    _tensor = Tensor({
      'depth': _this.getProperty('derived-depth'),
      'mrr': Number(_this.getProperty('tensor-mrr')),
      'mtt': Number(_this.getProperty('tensor-mtt')),
      'mpp': Number(_this.getProperty('tensor-mpp')),
      'mrt': Number(_this.getProperty('tensor-mrt')),
      'mrp': Number(_this.getProperty('tensor-mrp')),
      'mtp': Number(_this.getProperty('tensor-mtp')),
      'type': type,
    });

    el = _this.el;
    el.innerHTML = '<div class="magnitude-summary-view">' +
          '<table>' +
            '<thead>' +
              '<tr>' +
                '<th>Parameter</th>' +
                '<th>Value</th>' +
                '<th>Uncertainty</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody class="magnitude-details"></tbody>' +
          '</table>' +
          '<div class="magnitude-versions"></div>' +
        '</div>';

    _magnitudeDetailsEl = el.querySelector('.magnitude-details');
    _magnitudeDetailsEl.innerHTML = _this.buildMagnitudeDetailsMarkup();
    _this.displayBeachBall();

    _magnitudeVersionsEl = el.querySelector('.magnitude-versions');
    _magnitudeCollectionView = MagnitudeCollectionView({
      el: _magnitudeVersionsEl,
      collection: _collection,
      model: _this.model
    });
    _magnitudeCollectionView.render();
  };

  _this.buildMagnitudeDetailsMarkup = function () {
    var associatedBy,
        azimuthalGap,
        comment,
        condition,
        depth,
        fit,
        inputSource,
        internal,
        latitude,
        longitude,
        magnitude,
        markup,
        moment,
        nodalPlane1,
        nodalPlane2,
        observations,
        percentDoubleCouple,
        preferred,
        publishable,
        source,
        time,
        varianceReduction;

    associatedBy = _this.getProperty('associated-by-installation') + ' - ' +
        _this.getProperty('associated-by');
    azimuthalGap = _this.getProperty('azimuthal-gap');
    comment = _this.getProperty('comment');
    condition = _this.getProperty('condition');
    depth = _this.getProperty('derived-depth');
    fit = _this.getProperty('fit');
    inputSource = _this.getProperty('inputSource');
    internal = _this.getProperty('is-internal');
    latitude = _this.getProperty('derived-latitude');
    longitude = _this.getProperty('derived-longitude');
    magnitude = _this.getProperty('derived-magnitude') + ' ' +
        _this.getProperty('derived-magnitude-type');
    moment = _this.getProperty('scalar-moment');
    observations = _this.getProperty('num-stations-used') + ' (' +
        _this.getProperty('num-stations-associated') + ')';
    percentDoubleCouple = _this.getProperty('percent-double-couple');
    preferred = _this.getProperty('is-preferred-for-type');
    publishable = _this.getProperty('is-publishable');
    source = _this.getProperty('installation') + ' - ' +
        _this.getProperty('author');
    time = _this.getProperty('derived-eventtime');
    varianceReduction = _this.getProperty('variance-reduction');
    nodalPlane1 = 'Strike: ' + _this.getProperty('nodal-plane-1-strike') +
        ' Dip: ' + _this.getProperty('nodal-plane-1-dip') +
        ' Rake: ' + _this.getProperty('nodal-plane-1-slip');
    nodalPlane2 = 'Strike: ' + _this.getProperty('nodal-plane-2-strike') +
        ' Dip: ' + _this.getProperty('nodal-plane-2-dip') +
        ' Rake: ' + _this.getProperty('nodal-plane-2-slip');

    // TODO, remove this
    var value = '<b>TODO</b>';

    markup =
      _this.buildEventDetailsMarkup() +
      '<tr>' +
        '<td>Magnitude</td>' +
        '<td>' + magnitude + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Observations</td>' +
        '<td>' + observations + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Mw\'</td>' +
        '<td>' + value + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Weight</td>' +
        '<td>' + value + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Source</td>' +
        '<td>' + source + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Internal</td>' +
        '<td>' + internal + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Preferred For Type</td>' +
        '<td>' + preferred + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Publishable</td>' +
        '<td>' + publishable + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Associated By</td>' +
        '<td>' + associatedBy + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Comment</td>' +
        '<td>' + comment + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Moment</td>' +
        '<td>' + moment + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Solution Time</td>' +
        '<td>' + time + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Solution Location</td>' +
        '<td>' + _formatter.location(latitude, longitude) + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Solution Depth</td>' +
        '<td>' + _formatter.distance(depth, 'km') + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Solution Method</td>' +
        '<td>' + value + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Fit</td>' +
        '<td>' + fit + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Variance Reduction</td>' +
        '<td>' + varianceReduction + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Percent Double Couple</td>' +
        '<td>' + _formatter.number(percentDoubleCouple * 100, 0, '', '%') + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Focal Mechanism</td>' +
        '<td class="beach-ball-view"></td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Nodal Plane 1</td>' +
        '<td>' + nodalPlane1 + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Nodal Plane 2</td>' +
        '<td>' + nodalPlane2 + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Percent CLVD</td>' +
        '<td>' + value + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Source Time Function</td>' +
        '<td>' + value + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Input Source</td>' +
        '<td>' + inputSource + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Gap</td>' +
        '<td>' + azimuthalGap + '</td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td>Condition #</td>' +
        '<td>' + condition + '</td>' +
        '<td></td>' +
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

  _this.displayBeachBall = function () {
    var beachBallView,
        el;

    beachBallView = BeachBallView({
      fillColor: '#ccc',
      labelAxes: false,
      labelPlanes: false,
      size: 200,
      tensor: _tensor
    });
    beachBallView.render();

    el = _this.el.querySelector('.beach-ball-view');
    el.appendChild(beachBallView.el);
  };

  _this.buildEventDetailsMarkup = function () {
    return '<tr><td colspan="3">TODO:: Add 6 rows (preferred magnitude, region, time, location, depth, and time since). These details are provided by the event?</td></tr>';
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