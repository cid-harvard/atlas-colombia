import Ember from 'ember';

const {computed, observer, get:get } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['entity', 'entity_id', 'source', 'variable', 'vis', 'search', 'rca', 'startDate', 'endDate'],
  source: 'products',
  vis: 'treemap',
  variable: 'export_value',
  search: null,
  startDate: null,
  endDate: null,
  searchText: computed.oneWay('search'),
  builderNavDropDown: Ember.String.htmlSafe("<i class='icon-cidcon_placeholder-1 builder__icon--placeholder'></i>"),

  // observer the Query Params and set the links on the side nav
  setSideNav: observer('entity', 'entity_id', function() {
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', this.get('entity'));
    applicationController.set('entity_id', this.get('entity_id'));
  }),
  pageTitle: computed('model','source', 'entity', 'variable', 'vis', 'i18n.locale', function() {
    //locale file under graph_builder.page_title.<entity>.<source>.<variable>
    let i18nString = `graph_builder.page_title.${this.get('entity')}.${this.get('source')}.${this.get('variable')}`;
    if(this.get('vis') === 'scatter') {
      return this.get('i18n').t(`${i18nString}.${this.get('vis')}`, { name: this.get('model.name'), level: this.get('model._level') });
    }
    return this.get('i18n').t(i18nString, { name: this.get('model.name'), level: this.get('model._level') });
  }),
  builderModHeader: computed('model','source', 'entity', 'variable', 'vis', 'i18n.locale', function() {
    //locale file under graph_builder.builder_mod_header.<entity>.<source>.<variable>
    let i18nString = `graph_builder.builder_mod_header.${this.get('entity')}.${this.get('source')}.${this.get('variable')}`;
    if(this.get('vis') === 'scatter') {
      return this.get('i18n').t(`${i18nString}.${this.get('vis')}`, { name: this.get('model.name') });
    }
    return this.get('i18n').t(i18nString, { name: this.get('model.name') });
  }),
  rcaFilter: function(data) {
    return _.filter(data, (d) => {
      return get(d, this.get('rca')) <= 1;
    });
  },
  searchFilter: function(data) {
    let search = this.get('search');
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return _.filter(data, function(d) {
      return get(d,'name').match(regexp) || get(d, 'code').match(regexp);
    });
  },
  immutableData: computed('source','entity', 'entity_id',function() {
    let source = this.get('source');
    if(source  === 'products') {
      return this.get('model.productsData');
    } else if(source === 'industries') {
      return this.get('model.industriesData');
    }
  }),
  filteredData: computed('immutableData.[]', 'vis', 'search', function() {
    let data = this.get('immutableData');
    this.get('')
    if(this.get('vis') === 'scatter') { data = this.rcaFilter(data); }
    if(this.get('search')){ data = this.searchFilter(data); }
    return data;
  }),
  visualizationComponent: computed('vis', function(){
    let visualization = this.get('vis');
    if( visualization === 'treemap') {
      return 'd3plus-tree-map';
    } else if(visualization === 'multiples') {
      return 'multiples-graph';
    } else if(visualization === 'scatter') {
      return 'd3plus-scatter';
    }
  }),
  canChangeVisualization: computed('vis', function() {
    let visualization = this.get('vis');
    if(visualization === 'scatter') { return false; }
    return true;
  }),
  rca: computed('source', function() {
    let source = this.get('source');
    if(source === 'industries') { return 'rca'; }
    return 'export_rca';
  }),
  drawerSettingsIsOpen: false,
  drawerChangeGraphIsOpen: false,
  actions: {
    search: function() {
      this.set('search', this.get('searchText'));
    },
    toggleVisualization: function(visualization) {
      this.send('toggleDrawerChangeGraph');
      this.set('vis', visualization);
    },
    toggleDrawerSettings: function() {
      // Turn off other drawers
      this.set('drawerChangeGraphIsOpen', false);

      // Turn on settings drawer
      this.toggleProperty('drawerSettingsIsOpen');
    },
    toggleDrawerChangeGraph: function() {
      // Turn off other drawers
      this.set('drawerSettingsIsOpen', false);

      // Turn on settings drawer
      this.toggleProperty('drawerChangeGraphIsOpen');
    },
    zoomOut: function() {
      if(this.get('zoom') === 1) { this.decrementProperty('zoom'); }
    },
    zoomIn: function() {
      if(this.get('zoom') === 0) { this.incrementProperty('zoom'); }
    }
  }
});


