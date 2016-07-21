'use strict';


var Collection = require('mvc/Collection'),
    EventModel = require('EventModel'),
    EventSummaryView = require('EventSummaryView'),
    MagnitudeCollectionView = require('MagnitudeCollectionView'),
    Util = require('util/Util'),
    View = require('mvc/View'),
    Xhr = require('util/Xhr');


var _DEFAULTS;

_DEFAULTS = {
  eventWsUrl: '/ws/hydra/event.json',
  magnitudeUrl: 'magnitude.html'
};


var EventSearchView = function (options) {
  var _this,
      _initialize,

      _onHuidKeyUp,
      _onSearchClick;


  options = Util.extend({model: EventModel()}, _DEFAULTS, options);
  _this = View(options);

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
    _this.eventSummaryEl = el.querySelector('.event-search-event-summary');
    _this.magnitudeCollectionEl = el.querySelector(
        '.event-search-magnitude-collection');


    // Bind to DOM events to take action
    _this.huidEl.addEventListener('keyup', _onHuidKeyUp);
    _this.searchBtn.addEventListener('click', _onSearchClick);


    // Bind to MVC events to take action
    _this.magnitudeCollection.on('select', 'onMagnitudeSelect', _this);

    // Views
    _this.eventSummaryView = EventSummaryView({
      el: _this.eventSummaryEl,
      model: _this.eventModel
    });

    _this.magnitudeCollectionView = MagnitudeCollectionView({
      el: _this.magnitudeCollectionEl,
      collection: _this.magnitudeCollection
    });
  };


  _onHuidKeyUp = function (evt) {
    return _this.onHuidKeyUp(evt);
  };

  _onSearchClick = function (evt) {
    return _this.onSearchClick(evt);
  };


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

  _this.onMagnitudeSelect = function () {
    var magnitude;

    magnitude = _this.magnitudeCollection.getSelected();
    if (magnitude) {
      _this.openMagnitudeDisplay(magnitude);
    }
  };

  _this.onSearchClick = function (/*evt*/) {
    _this.search(_this.huidEl.value);
  };

  _this.onSearchError = function (err/*, xhr*/) {
    console.log(err);

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

  _this.onSearchSuccess = function (data/*, xhr*/) {
    console.log(data);

    Util.empty(_this.messageEl);

    _this.eventModel.reset(EventModel.parseAttributes(data));
    _this.magnitudeCollection.reset(_this.eventModel.get('magnitudes') || []);
  };

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
