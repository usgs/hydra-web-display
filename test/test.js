/* global mocha */
'use strict';


mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/event/EventSearchViewTest');
require('./spec/event/EventSummaryViewTest');

require('./spec/util/FormatterTest');

require('./spec/magnitude/MagnitudeCollectionTableTest');
require('./spec/magnitude/MagnitudeDisplayTest');
require('./spec/magnitude/MagnitudeSummaryViewTest');
require('./spec/magnitude/MagnitudeTabViewTest');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
