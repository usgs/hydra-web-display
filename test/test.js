/* global mocha */
'use strict';


mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/EventSearchViewTest');
require('./spec/EventSummaryViewTest');
require('./spec/FormatterTest');
require('./spec/MagnitudeCollectionTableTest');
require('./spec/MagnitudeTabViewTest');

require('./spec/MagnitudeSummaryViewTest');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
