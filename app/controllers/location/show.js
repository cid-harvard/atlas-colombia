import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['year'],

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  validTimeseries: computed.alias('model.timeseries'),
  departmentsData: computed.oneWay('model.departments'),
  productsData: computed.oneWay('model.productsData'),
  industriesData: computed.oneWay('model.industriesData'),

  isCountry: computed.equal('model.level', 'country'),
  isDepartment: computed.equal('model.level','department'),
  isMsa: computed.equal('model.level','msa'),
  isMuncipality: computed.equal('model.level','municipality'),

  locationId: computed('model.id','model.level', function() {
    return this.get('model.id');
  }),
  imageCode: computed('model.level', 'model.code', function() {
    if(this.get('isDepartment')  || this.get('isCountry')) {
      return this.get('model.code');
    } else {
      return (this.get('model.code')).substring(0,2);
    }
  }),
  productsSortedByExports: computed('productsData', function() {
    return _.slice(_.sortBy(this.get('productsData'), function(d) { return -d.export_value;}), 0, 50);
  }),
  exportTotal: computed('productsData', function() {
    var total = _.reduce(this.get('productsData'), function(memo, data) {
      return memo + data.export_value;
    }, 0);
    return '$' + numeral(total).format('0.0a') + ' USD';
  }),
  lastIndustryData: computed.filter('industriesData', function(datum) {
    return parseInt(get(datum, 'year')) === this.get('lastYear');
  }),
  graphbuilderLink: computed('model.id', function() {
    return `location-${this.get('model.id')}`;
  }),
  description: computed('model.name', 'i18n.locale', function() {
    return this.get(`model.description_${this.get('i18n.display')}`);
  }),
  thisLevel: computed('model.level', 'i18n.locale', function() {
    let level = this.get('i18n').t(`location.model.${this.get('model.level')}`);
    let thisLevel = `this ${level}`;

    if(this.get('model.level') === 'country') {
      thisLevel = level;
    } else if(this.get('i18n.display') === 'es') {
      thisLevel = level.string === 'ciudad' ? `esta ${level}` :  `este ${level}`;
    }

    return thisLevel;
  }),
});

