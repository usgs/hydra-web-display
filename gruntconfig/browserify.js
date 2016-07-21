'use strict';


var babelify = require('babelify'),
    config = require('./config'),
    glob = require('glob');


var BUNDLE_CLASSES,
    CWD,
    JS,
    NODE_MODULES;


CWD = process.cwd();
NODE_MODULES = CWD + '/node_modules';
JS = './' + config.src + '/htdocs/js';

BUNDLE_CLASSES = [
  JS + '/EventSearchView.js:EventSearchView',
  JS + '/EventSummaryView.js:EventSummaryView',
  JS + '/Formatter.js:Formatter',
  JS + '/MagnitudeCollectionTable.js:MagnitudeCollectionTable',
  JS + '/MagnitudeDisplay.js:MagnitudeDisplay',
  JS + '/MagnitudeSummaryView.js:MagnitudeSummaryView',
  JS + '/MagnitudeTabView.js:MagnitudeTabView',

  NODE_MODULES + '/hazdev-webutils/src/mvc/CollectionView.js:mvc/CollectionView',
  NODE_MODULES + '/hazdev-webutils/src/mvc/Model.js:mvc/Model',
  NODE_MODULES + '/hazdev-webutils/src/mvc/View.js:mvc/View',
  NODE_MODULES + '/hazdev-webutils/src/util/Events.js:util/Events',
  NODE_MODULES + '/hazdev-webutils/src/util/Util.js:util/Util',
  NODE_MODULES + '/hazdev-webutils/src/util/Xhr.js:util/Xhr',
];


Object.keys(config.jsPath).forEach(function (path) {
  var files,
      pattern;

  pattern = config.jsPath[path];
  if (pattern) {
    path = path + '/';
    files = glob.sync(path + pattern);
    files.forEach(function (file) {
      var alias;
      alias = file.replace(path, '').replace('.js', '');
      BUNDLE_CLASSES.push('./' + file + ':' + alias);
    });
  }
});


var browserify = {

  options: {
    browserifyOptions: {
      debug: true,
      paths: Object.keys(config.jsPath)
    },
    transform: [
      babelify.configure({
        presets: ['es2015']
      })
    ]
  },


  'bundle': {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: BUNDLE_CLASSES
    }
  },

  'entrypoints': {
    expand: true,
    cwd: './' + config.src + '/htdocs/js',
    dest: './' + config.build + '/' + config.src + '/htdocs/js',
    src: [
      '*.js'
    ],
    options: {
    }
  },

  'test': {
    src: config.test + '/test.js',
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: BUNDLE_CLASSES
    }
  }

};


module.exports = browserify;
