'use strict';


var FeatureModel = require('FeatureModel'),
    Util = require('util/Util');


var _DEFAULTS,
    _fromFeature;

_DEFAULTS = {
  depth: null,         // Depth of event. Number
  eventtime: null,     // Datetime of event. ISO String
  id: null,            // HUID. String
  latitude: null,      // Latitude coordinate of event. Number
  longitude: null,     // Longitude coordinate of event. Number
  magnitude: null,     // Magnitude of event. Number
  magnitudeType: null, // Type of magnitude. String
  magnitudes: [],      // List of magnitudes associated to event. Array
  title: null,         // Location description for event. String
  type: null           // Type of event. String
};


/**
 * Model for representing an event. This class directly extends {FeatureModel}.
 * The primary value from this class is the static `fromFeature` method
 * that parses a GeoJSON feature to produce an event model.
 *
 * @param options {Object}
 *     Attributes for the model.
 */
var EventModel = function (options) {
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


/**
 * Parses the provided GeoJSON Feature object into an EventModel.
 *
 * @param feature {GeoJSON.Feature}
 *     A GeoJSON feature object containing properties and other data that can
 *     be used as to generate the model's attributes.
 *
 * @return {EventModel}
 *     An event model.
 */
_fromFeature = function (feature) {
  var model;

  model = EventModel();
  model.reset(model.parseAttributes(feature));

  return model;
};


EventModel.fromFeature = _fromFeature;


module.exports = EventModel;
