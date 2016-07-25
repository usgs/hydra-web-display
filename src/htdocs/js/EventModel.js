'use strict';


var Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS,
    _fromFeature,
    _parseAttributes;

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
 * Model for representing an event. This class directly extends {mvc/Model}.
 * The primary value from this class is the static `fromFeature` method
 * that parses a GeoJSON feature to produce an event model.
 *
 * @param options {Object}
 *     Attributes for the model.
 */
var EventModel = function (options) {
  var _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = Model(options);


  _this.reset = function (attributes) {
    _this.set(Util.extend({}, _DEFAULTS, attributes));
  };


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
  return EventModel(_parseAttributes(feature));
};

/**
 * Parses the provided GeoJSON Feature object into an object containing
 * attributes as necessary for an EventModel.
 *
 * @param feature {GeoJSON.Feature}
 *     A GeoJSON feature object containing properties and other data that can
 *     be used as to generate the attributes.
 *
 * @return {Object}
 *     An event model.
 */
_parseAttributes = function (feature) {
  var attributes,
      coordinates;

  if (feature) {
    attributes = Util.extend({}, _DEFAULTS, feature.properties);

    coordinates = feature.geometry ? feature.geometry.coordinates : [];
    coordinates = coordinates || []; // if feature.geometry.coordinates is falsy

    // Read other attributes off feature, preferring null over undefined ...
    attributes.id = feature.id || null;
    attributes.longtiude = coordinates[0] || null;
    attributes.latitude = coordinates[1] || null;
    attributes.depth = coordinates[2] || null;
  }

  return attributes || {};
};


EventModel.NULL_MODEL = JSON.parse(JSON.stringify(_DEFAULTS));
EventModel.fromFeature = _fromFeature;
EventModel.parseAttributes = _parseAttributes;


module.exports = EventModel;
