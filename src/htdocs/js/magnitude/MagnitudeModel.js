'use strict';


var FeatureModel = require('util/FeatureModel'),
    Util = require('util/Util');


var _DEFAULTS,
    _fromFeature;


_DEFAULTS = {
  'associated-by': null,
  'associated-by-installation': null,
  'author': null,
  'depth': null,
  'derived-magnitude': null,
  'derived-magnitude-type': null,
  'id': null,
  'installation': null,
  'is-internal': null,
  'is-preferred-for-type': null,
  'latitude': null,
  'longitude': null,
  'moment-tensors': [],
  'num-stations-associated': null,
  'num-stations-used': null
};


var MagnitudeModel = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = FeatureModel(options);

  _initialize = function (/*options*/) {
    _this.defaults = JSON.parse(JSON.stringify(_DEFAULTS));
  };


  _initialize(options);
  options = null;
  return _this;
};


_fromFeature = function (feature) {
  var model;

  model = MagnitudeModel();
  model.reset(model.parseAttributes(feature));

  return model;
};


MagnitudeModel.fromFeature = _fromFeature;

module.exports = MagnitudeModel;
