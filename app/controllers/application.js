import Ember from 'ember';
import numeral from 'numeral';

const {observer, computed} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['locale'],
  init: function(){
    //refactor this later please...QL
    this._super.apply(this, arguments);
    var localeParam = this.get('locale');

    // check if param is valid
    //  if not default to defauleLocale
    if(localeParam === this.get('i18n.otherLocale')){
      this.set('locale', this.get('i18n.otherLocale'));
    } else if(localeParam === 'no-copy'){
      this.set('i18n.locale', 'no-copy');
    } else {
      this.set('locale', this.get('i18n.defaultLocale'));
    }

    this.set('i18n.locale', this.get('locale'));
    this.set('i18n.display', this.get('i18n.locale').split('-')[0]);
    this.set('isDefaultLocale', this.get('i18n.locale') === this.get('i18n.defaultLocale'));
  },
  defaultLanguage: computed('i18n.default', function() {
    return this.get('i18n.defaultLocale').substring(0,2);
  }),
  otherLanguage: computed('i18n.other', function() {
    return this.get('i18n.otherLocale').substring(0,2);
  }),
  setLanguageToggle: observer('isDefaultLocale',function() {
    if(this.get('i18n.locale') === this.get('i18n.defaultLocale')) {
      this.set('i18n.locale', this.get('i18n.otherLocale'));
      this.set('i18n.display', this.get('i18n.locale').split('-')[0]);
      numeral.language(this.get('i18n.otherLocale'));
    } else {
      this.set('i18n.locale', this.get('i18n.defaultLocale'));
      this.set('i18n.display', this.get('i18n.locale').split('-')[0]);
      numeral.language(this.get('i18n.defaultLocale'));
    }
  }),
  updateLocale: observer('i18n.locale', function() {
    this.set('locale', this.get('i18n.locale'));
  }),
  updateNoCopy: observer('locale', function() {
    if(this.get('locale') === 'no-copy'){
      this.set('i18n.locale', 'no-copy');
      this.set('locale', this.get('i18n.locale'));
    }
  }),
  productsMetadata: computed('model.products', function() {
    return this.get('model.products');
  }),
  locationsMetadata: computed('model.locations', function(){
    return this.get('model.locations');
  }),
  industriesMetadata: computed('model.industries', function() {
    return this.get('model.industries');
  }),
  hasProfile: computed('entity', 'entity_level', function() {
    let entity = this.get('entity');
    let level = this.get('entity_level');
    if(entity === 'product') { return false; }
    if(entity === 'industry' && level === 'class') { return false; }
    return true;
  }),
  profileLink: computed('entity', function(){
    if(this.get('entity') === 'location') { return 'location.show'; }
    if(this.get('entity') === 'product') { return 'product.show'; }
    if(this.get('entity') === 'industry') { return 'industry.show'; }
  }),
  entityId: computed('entity_id', function() {
    return this.get('entity_id');
  }),
  entity_and_id: computed('entity', 'entity_id', function() {
    return `${this.get('entity')}-${this.get('entity_id')}`;
  }),
  source: computed('entity', function() {
    if(this.get('entity') === 'location') { return 'products'; }
    if(this.get('entity') === 'product') { return 'locations'; }
    if(this.get('entity') === 'industry') { return 'departments'; }
  })
});
