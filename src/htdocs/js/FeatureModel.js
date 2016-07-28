'use strict';


var Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS,
    _fromFeature;

// Enummerate all possible attributes from a feature.properties
_DEFAULTS = {};


var FeatureModel = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = Model(options);

  _initialize = function (/*options*/) {
    _this.defaults = JSON.parse(JSON.stringify(_DEFAULTS));
  };


  _this._getDefaults = function () {
    return _this.defaults;
  };


  _this.augmentAttributes = function (attributes) {
    return attributes;
  };

  _this.parseAttributes = function (feature) {
    var attributes,
        coordinates;

    if (feature) {
      attributes = Util.extend({}, _this._getDefaults(), feature.properties);

      coordinates = feature.geometry ? feature.geometry.coordinates : [];
      coordinates = coordinates || [];

      // Read other attributes off feature, preferring null over undefined ...
      attributes.id = feature.id || null;
      attributes.longitude = coordinates[0] || null;
      attributes.latitude = coordinates[1] || null;
      attributes.depth = coordinates[2] || null;
    }

    attributes = _this.augmentAttributes(attributes);

    return attributes || {};
  };

  _this.reset = function (attributes) {
    _this.set(Util.extend({}, _this._getDefaults(), attributes));
  };


  _initialize(options);
  options = null;
  return _this;
};


_fromFeature = function (feature) {
  var model;

  model = FeatureModel();
  model.reset(model.parseAttributes(feature));

  return model;
};


FeatureModel.fromFeature = _fromFeature;

module.exports = FeatureModel;
