/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'atlas-colombia',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      defaultLocale: 'en',
      env: environment
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // need to fix for production mode
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' http://54.6.95.239 *",
      'style-src': "'self' 'unsafe-inline' *",
      'img-src': "'self' http://placehold.it/40x40 *"
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.baseURL = '/atlas-colombia',
    ENV.locationType = 'hash',
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' http://54.6.95.239 *",
      'img-src': "'self' http://placehold.it/40x40 *"
    }
  }

  return ENV;
};
