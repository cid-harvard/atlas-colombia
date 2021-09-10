import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview,{
  location: config.locationType
});

export default Router.map(function() {
  this.route('search');
  this.route('downloads');
  this.route('colombia');

  // About
  this.resource('about', function() {
    this.route('project-description', { path: 'project-description'});
    this.route('glossary', { path: 'glossary'});
    this.route('header-menu', { path: 'header-menu'});
    this.route('stylesheet', { path: 'stylesheet'});
  });

  // Graph Builder

  // Profiles
  this.resource('product', { path: 'product'}, function() {
    this.route('show', { path: ':product_id'});
    this.route('visualization', { path: ':product_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('location', { path: 'location'}, function() {
    this.route('show', {path: ':location_id'});
    this.route('route', {path: ':location_id/route/'});
    this.route('visualization', { path: ':location_id/source/:source_type/visualization/:visualization_type/:variable'});
    this.route('visualization-product', { path: ':location_id/product/:product_id/visualization/:visualization_type/:variable'});
  });
  this.resource('industry', { path: 'industry'}, function() {
    this.route('show', { path: ':industry_id'});
    this.route('visualization', { path: ':industry_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('landUse', { path: 'landUse'}, function() {
    this.route('show', { path: ':landUse_id'});
    this.route('visualization', { path: ':landUse_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('agproduct', { path: 'agproduct'}, function() {
    this.route('show', { path: ':agproduct_id'});
    this.route('visualization', { path: ':agproduct_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('nonag', { path: 'nonag'}, function() {
    this.route('show', { path: ':nonag_id'});
    this.route('visualization', { path: ':nonag_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('livestock', { path: 'livestock'}, function() {
    this.route('show', { path: ':livestock_id'});
    this.route('visualization', { path: ':livestock_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.route('rankings');
});
