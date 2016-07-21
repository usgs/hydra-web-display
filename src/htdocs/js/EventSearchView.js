'use strict';


var Collection = require('mvc/Collection'),
    EventModel = require('EventModel'),
    EventSummaryView = require('EventSummaryView'),
    MagnitudeCollectionTable = require('MagnitudeCollectionTable'),
    Util = require('util/Util'),
    View = require('mvc/View'),
    Xhr = require('util/Xhr');


var _DEFAULTS;

_DEFAULTS = {
  eventWsUrl: 'event.json',
  magnitudeUrl: 'magnitude.html'
};


/**
 * Top-level class for displaying the event search page. On this page
 * the user is presented with a search box and search button. The user may
 * enter an HUID into the search box and press enter or click the search
 * button to perform a search.
 *
 * The search should return event data matching the HUID. This event data
 * is rendered as an event summary and a list of available magnitudes.
 * Clicking on a magnitude should open the MagnitudeDisplay.
 *
 * This class is largely throw-away once Hydra integrates with the web
 * display.
 *
 *
 * @param options {Object}
 *     Configuration options. See EventSearchView#_initialize for details.
 */
var EventSearchView = function (options) {
  var _this,
      _initialize,

      _onHuidKeyUp,
      _onSearchClick;


  options = Util.extend({model: EventModel()}, _DEFAULTS, options);
  _this = View(options);

  /**
   * Constructor for this view.
   *
   * Parses configuration options and provides defaults as necessary. Builds
   * the DOM skeleton and delegates rendering details to sub-views. Binds
   * event listeners to top-level DOM elements (for "Enter" keypress and
   * search button click) as well as an event binding to open the
   * MagnitudeDisplay when a magnitude is selected.
   *
   *
   * @param options {Object}
   *     Configuration options for this view.
   * @param options.eventWsUrl {String}
   *     Url to the event search web service endpoint.
   * @param options.magnitudeUrl {String}
   *     Url to the magnitude display page.
   */
  _initialize = function (options) {
    var el;

    _this.magnitudes = options.magnitudes || Collection([]);
    _this.eventWsUrl = options.eventWsUrl;
    _this.magnitudeUrl = options.magnitudeUrl;

    _this.eventModel = options.event || EventModel();
    _this.magnitudeCollection = Collection(
        _this.eventModel.get('magnitudes') || []);

    el = _this.el;
    el.innerHTML =
        '<article class="event-search-view">' +
          '<header class="event-search-header">' +
            '<h1>Search for an Event</h1>' +
            '<input type="text" name="huid" class="event-search-huid" ' +
                'placeholder="HUID" />' +
            '<button class="event-search-button">search</button>' +
            '<div class="event-search-messages"></div>' +
          '</header>' +
          '<section class="event-search-content">' +
            '<div class="event-search-event-summary"></div>' +
            '<div class="horizontal-scrolling ' +
                'event-search-magnitude-collection"></div>' +
          '</div>' +
          '<footer class="event-search-footer"></footer>' +
        '</article>';


    // Store references to DOM containers
    _this.huidEl = el.querySelector('.event-search-huid');
    _this.searchBtn = el.querySelector('.event-search-button');
    _this.messageEl = el.querySelector('.event-search-messages');


    // Bind to DOM events to take action
    _this.huidEl.addEventListener('keyup', _onHuidKeyUp);
    _this.searchBtn.addEventListener('click', _onSearchClick);


    // Bind to MVC events to take action
    _this.magnitudeCollection.on('select', 'onMagnitudeSelect', _this);

    // Views
    _this.eventSummaryView = EventSummaryView({
      el: el.querySelector('.event-search-event-summary'),
      model: _this.eventModel
    });

    _this.magnitudeCollectionView = MagnitudeCollectionTable({
      el: el.querySelector('.event-search-magnitude-collection'),
      collection: _this.magnitudeCollection
    });
  };


  /**
   * Private event handler that delegates to public event handler for
   * testability.
   *
   */
  _onHuidKeyUp = function (evt) {
    return _this.onHuidKeyUp(evt);
  };

  /**
   * Private event handler that delegates to public event handler for
   * testability.
   *
   */
  _onSearchClick = function (evt) {
    return _this.onSearchClick(evt);
  };


  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    // Remove event listeners
    _this.huidEl.removeEventListener('keyup', _onHuidKeyUp);
    _this.searchBtn.removeEventListener('click', _onSearchClick);

    _this.magnitudeCollection.off('select', 'onMagnitudeSelect', _this);

    // Destroy sub-views etc...
    if (_this.eventSummaryView) {
      _this.eventSummaryView.destroy();
      _this.eventSummaryView = null;
    }

    if (_this.magnitudeCollectionView) {
      _this.magnitudeCollectionView.destroy();
      _this.magnitudeCollectionView = null;
    }

    // Nullify members
    _onHuidKeyUp = null;
    _onSearchClick = null;


    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Event handler fired when the "keyup" event is fired on the input box.
   * This handler checks if the keyup event maps to the "Enter" key press,
   * and if so, it executes a search for the current value in the search field.
   *
   * @param evt {KeyUpEvent}
   *     The event that triggered this function call. Should contain
   *     a "keyCode" or "which" property identifying the key that was pressed.
   */
  _this.onHuidKeyUp = function (evt) {
    if (evt && (evt.keyCode === 13 || evt.which === 13)) {
      _this.search(_this.huidEl.value);

      evt.cancelBubble = true;

      if (typeof evt.preventDefault === 'function') {
        return evt.preventDefault();
      } else {
        return false;
      }
    }
  };

  /**
   * Event handler fired when a magnitude is selected from the collection of
   * magnitudes. If the selected magnitude is not null, the MagnitudeDisplay
   * is opened for that magnitude.
   *
   */
  _this.onMagnitudeSelect = function () {
    var magnitude;

    magnitude = _this.magnitudeCollection.getSelected();
    if (magnitude) {
      _this.openMagnitudeDisplay(magnitude);
    }
  };

  /**
   * Event hander fired when the search button is clicked. Executes a search
   * with the current value in the search field.
   *
   * @param evt {ClickEvent}
   *     The click event that triggered this event handler.
   */
  _this.onSearchClick = function (/*evt*/) {
    _this.search(_this.huidEl.value);
  };

  /**
   * Callback executed when an error occur while searching or processing
   * the results.
   *
   * @param err {String|Error}
   *     The error that triggered this call. Could be a String or an Error.
   *
   * @param xhr {XMLHttpRequest} Optional. Default: undefined.
   *     The XMLHttpRequest for the search.
   */
  _this.onSearchError = function (err/*, xhr*/) {
    _this.eventModel.reset(EventModel.NULL_MODEL);
    _this.magnitudeCollection.reset([]);

    _this.messageEl.innerHTML = [
      '<p class="alert error">',
        'An error occurred fetching data.',
        '<br/>',
        (err.message ? err.message : err),
      '</p>'
    ].join('');
  };

/**
 * Callback executed when a search completes successfully.
 *
 * This method clears any previous error messages and updates the EventModel
 * (for the EventSummaryView to render) and the magnitude Collection (for the
 * MagnitudeCollectionView to render).
 *
 * @param data {GeoJSONFeature}
 *     Event details formatted as a GeoJSON Feature object.
 * @param xhr {XMLHttpRequest} Optional. Default: undefined.
 *     The original search request.
 */
  _this.onSearchSuccess = function (data/*, xhr*/) {
    if (_this === null) {
      console.log('null');
    }
    Util.empty(_this.messageEl);

    _this.eventModel.reset(EventModel.parseAttributes(data));
    _this.magnitudeCollection.reset(_this.eventModel.get('magnitudes') || []);
  };

  /**
   * Opens the magntiude display for the given magnitude object. It is
   * assumed the magnitude corresponds the the currently selected EventModel.
   *
   * @param magnitude {Object}
   *     An object containing magnitude summary information. Specifically:
   *     "author", "installation", "type" attributes.
   */
  _this.openMagnitudeDisplay = function (magnitude) {
    var url;

    url = [
      _this.magnitudeUrl, '#',
        '?huid=', _this.eventModel.get('id'),
        '&author=', magnitude.author,
        '&installation=', magnitude.installation,
        '&type=', magnitude.type
    ].join('');

    window.open(url, 'hydra-magnitude-display');
  };

  /**
   * Executes a search for event information based on the given `huid`.
   *
   * @param huid {String}
   *     The hydra unique identifier for the desired event.
   */
  _this.search = function (huid) {
    Xhr.ajax({
      url: _this.eventWsUrl,
      data: {huid: huid},
      success: _this.onSearchSuccess,
      error: _this.onSearchError
    });
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSearchView;
