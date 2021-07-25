import Ember from 'ember';
const {computed,  get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query','filter'],
  entity: ['product', 'industry', 'location', 'rural'],
  query: null,
  filter: null,
  modelData: computed('model', 'i18n.locale', function() {
    let model = get(this, 'model');
    let locale = this.get('i18n').display

    return model.map(function(models){
      if(models.get('profileName') === "agproduct"){
        return {id: models.id, text: models.get(`name_${locale}`) }
      }
      else{
        return {id: models.id, text: models.get(`name_short_${locale}`) + " (" + models.get('code') + ")" }
      }
    })
  }),
  search: computed('query', function() {
    return this.get('query');
  }),
  modelCategorized: computed('filter', 'model', function(){
    return _.groupBy(this.get('model'), (x)=>x.constructor.modelName);
  }),
  modelCategorizedKeys: computed('modelCategorized', function(){
    return _.keys(this.get('modelCategorized'));
  }),
  referenceKey: computed('modelCategorizedKeys', function(){
    return this.get('modelCategorizedKeys')[0];
  }),
  referenceBody: computed('modelCategorized', 'referenceKey', function(){
    return this.get(`modelCategorized.${this.get('referenceKey')}`);
  }),
  sortDefinition: ["name"],
  sortedReferenceBody: computed.sort('referenceBody', 'sortDefinition'),
  results: computed('model.[]', 'query', function() {
    if (this.get("query") === null){
      return [];
    }
    let search = _.deburr(this.get('query'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return this.get('model').filter((d) => {
      let longName = get(d, 'name_long');
      let shortName = get(d,'name_short');
      let code = get(d, 'code');

      //Custom code to remove Bogota muni,  this is bad and should be removed
      if(d.get('name') === "Bogotá, D.C." && d.get('level') === 'municipality'){
        return false;
      }
      return _.deburr(`${shortName} ${longName} ${code}`).match(regexp);
    });
  }),
  resultsLength: computed('results.[]', function() {
    return this.get('results').length;
  }),
  productResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'product';
    });
  }),
  agproductResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'agproduct';
    });
  }),
  nonagResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'nonag';
    });
  }),
  livestockResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'livestock';
    });
  }),
  landuseResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'land-use';
    });
  }),
  locationResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'location';
    });
  }),
  industryResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'industry';
    });
  }),
  placeHolderText: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `pageheader.search_placeholder.${this.get('filter')}`;
    }
    return `pageheader.search_placeholder`;
  }),
  actions:{
    toggleReferenceKey(key) {
      this.set("referenceKey", key);
    },
    transitionLocation(id) {
      this.transitionToRoute('location.show', id);
    },
    transitionProduct(id) {
      this.transitionToRoute('product.show', id);
    },
    transitionIndustry(id) {
      this.transitionToRoute('industry.show', id);
    },
    transitionAgproduct(id) {
      this.transitionToRoute('agproduct.show', id);
    },
  }
});

