import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;

export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true }, // location, product, industry
    entity_id: { refreshModel: true }, // Id of the entities
    source: { refreshModel: true }, // products, industries,
    variable: { refreshModel: true }, //export_value, import_value, wages, employment
    vis: { refreshModel: false }, // treemap, multiples, scatter
    search: { refreshModel: false }
  },
  model: function(queryParams) {
    return this.store.find(queryParams.entity, queryParams.entity_id);
  },
  afterModel: function(model, transition) {
    var data = Ember.getWithDefault(transition, 'queryParams.source', 'products');
    if(data  === 'products'){
      return this.setProducts(model);
    } if (data === 'industries') {
      return this.setIndustries(model);
    }
  },
  setProducts: function(model){
    var products = Ember.$.getJSON(`${apiURL}data/products?location=${model.id}`);
    var productsData = Ember.$.getJSON(`${apiURL}data/products/scatterplot?location=${model.id}&year=2012`);
    return Ember.RSVP.allSettled([products, productsData])
      .then((array) => {
        let products = Ember.getWithDefault(array[0], 'value.data', []);
        let productsData = Ember.getWithDefault(array[1], 'value.data', []);
        let productsMetadata = this.modelFor('application').products;

          _.each(products, function(d) {
            let product = _.find(productsMetadata, { id: d.product_id });
            let productData = _.find(productsData, { product_id: d.product_id });
            d.name = product.name_en;
            _.extend(d, product);
            _.extend(d, productData);
          });

          model.set('productsData', products);
        })
      .then(function() { window.scrollTo(0,0);});
  },
  setIndustries: function(model) {
    var industries = Ember.$.getJSON(`${apiURL}data/industries?location=${model.id}`);
    // industriesData has the RCA and Complexity
    var industriesData = Ember.$.getJSON(`${apiURL}data/industries/scatterplot?location=${model.id}&year=2012`);
    return Ember.RSVP.allSettled([industries, industriesData])
      .then((array) => {
        let industries = Ember.getWithDefault(array[0], 'value.data', []);
        let industriesData = Ember.getWithDefault(array[1], 'value.data', []);
        let industriesMetadata = this.modelFor('application').industries;

        _.each(industries, function(d) {
          let industry = _.find(industriesMetadata, { id: d.industry_id });
          let industryData = _.find(industriesData, { industry_id: d.industry_id });
          d.name = industry.name_en;
          _.extend(d, industry);
          _.extend(d, industryData);
        });

        model.set('industriesData', industries);
      })
      .then(function() { window.scrollTo(0,0);});
   }
});

