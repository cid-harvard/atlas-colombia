import Ember from 'ember';
const {computed} = Ember;

export default Ember.Mixin.create({
  featureToggle: Ember.inject.service('feature-toggle'),
  columnSettingsMap: [
    { key: 'average_wages', type: 'int', savedWidth: 290 },
    { key: 'avg_wage', type: 'int', savedWidth: 290 },
    { key: 'code', savedWidth: 120 },
    { key: 'cog' , type: 'int', savedWidth: 200 },
    { key: 'coi' , type: 'int', savedWidth: 280 },
    { key: 'industry_coi' , type: 'int', savedWidth: 280 },
    { key: 'complexity' , type: 'int', savedWidth: 180 },
    { key: 'distance' , type: 'int', savedWidth: 110 },
    { key: 'employment', type: 'int', savedWidth: 130 },
    { key: 'employment_growth', type: 'int', savedWidth: 280 },
    { key: 'export_num_plants' , type: 'int', savedWidth: 200 },
    { key: 'export_rca', type: 'int', savedWidth: 280 },
    { key: 'export_value', type: 'int', savedWidth: 180 },
    { key: 'import_value', type: 'int', savedWidth: 180 },
    { key: 'monthly_wages', type: 'int', savedWidth: 290 },
    { key: 'name', copy: 'export', savedWidth: 230 },
    { key: 'num_establishments' , type: 'int', savedWidth: 200 },
    { key: 'num_vacancies', type: 'int', savedWidth: 100 },
    { key: 'parent', savedWidth: 270 },
    { key: 'parent_name', savedWidth: 200 },
    { key: 'rca', type: 'int', savedWidth: 280 },
    { key: 'wages', type: 'int', savedWidth: 330 },
    { key: 'year' , type: 'int', savedWidth: 80 },
    { key: 'ranking' , type: 'int', savedWidth: 80 },
    { key: 'eci' , type: 'int', savedWidth: 210 },
    { key: 'industry_eci' , type: 'int', savedWidth: 210 },
    { key: 'gdp_pc_real' , type: 'int', savedWidth: 200 },
    { key: 'gdp_real' , type: 'int', savedWidth: 190 },
    { key: 'share' , type: 'int', savedWidth: 190 },
    { key: 'population' , type: 'int', savedWidth: 180 },
    { key: 'num_farms' , type: 'int', savedWidth: 270 },
    { key: 'num_farms_ag' , type: 'int', savedWidth: 420 },
    { key: 'num_farms_nonag' , type: 'int', savedWidth: 370 },
    { key: 'num_livestock' , type: 'int', savedWidth: 200 },
    { key: 'average_livestock_load' , type: 'int', savedWidth: 220 },
    { key: 'land_sown' , type: 'int', savedWidth: 180 },
    { key: 'land_harvested' , type: 'int', savedWidth: 180 },
    { key: 'production_tons' , type: 'int', savedWidth: 170 },
    { key: 'yield_ratio' , type: 'int', savedWidth: 260 },
    { key: 'yield_index' , type: 'int', savedWidth: 260 },
    { key: 'area' , type: 'int', savedWidth: 180 },
  ],
  industryClassesMap: [
    { key: 'code' },
    { key: 'name', copy: 'industry' },
    { key: 'avg_wage' },
    { key: 'wages' },
    { key: 'employment' },
    { key: 'employment_growth' },
    { key: 'num_establishments' }
  ],
  productsMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'export' },
      { key: 'parent' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_rca' },
      { key: 'complexity' },
      { key: 'distance' },
      { key: 'cog' }
    ];

    if(!this.get('featureToggle.isPeru')) {
      columns.splice(5, 0, {key: 'export_num_plants'});
    }

    if(this.get('featureToggle.showImports')) {
      return columns.concat({key: 'import_value'});
    } else {
      return columns;
    }

  }),
  productsExportsMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'name' },
      { key: 'parent' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_rca' },
      { key: 'export_num_plants' },
    ];

    return columns;

  }),
  productsImportsMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'name' },
      { key: 'parent' },
      { key: 'year' },
      { key: 'import_value' },
      { key: 'rca' },
      { key: 'import_num_plants' },
    ];

    return columns;

  }),
  industriesTopMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'name', copy: 'industry' },
      { key: 'parent' },
      { key: 'year' },
      { key: 'employment' },
      { key: 'wages' },
      { key: 'num_establishments' },
     ]

    return columns;

  }),
  citiesMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'parent.location' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_num_plants' },
      { key: 'export_rca' },
      { key: 'distance' },
      { key: 'cog' }
     ];

    if(this.get('featureToggle.showImports')) {
      columns = columns.concat({key: 'import_value'});
    }

    if(this.get('featureToggle.showIndustries')) {
      columns = columns.concat(
        { key: 'monthly_wages' },
        { key: 'wages' },
        { key: 'employment' },
        { key: 'num_establishments' }
      );
    }

    return columns;
  }),
  municipalitiesMap: [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'parent.location' },
      { key: 'year' },
      { key: 'area' },
  ],
  industriesMap: [
    { key: 'code' },
    { key: 'name', copy: 'industry' },
    { key: 'parent' },
    { key: 'year' },
    { key: 'monthly_wages' },
    { key: 'wages' },
    { key: 'employment' },
    { key: 'num_establishments' },
    { key: 'rca' },
    { key: 'complexity' },
    { key: 'cog' },
    { key: 'distance' }
   ],
  departmentsMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'year' },
      { key: 'rca' },
      { key: 'distance' },
      { key: 'export_value' },
      { key: 'export_num_plants' },
      { key: 'export_rca' },
      { key: 'cog' }
     ];

    if(this.get('featureToggle.showImports')) {
      columns = columns.concat({key: 'import_value'});
    }

    if(this.get('featureToggle.showIndustries')) {
      columns = columns.concat(
        { key: 'monthly_wages' },
        { key: 'wages' },
        { key: 'employment' },
        { key: 'num_establishments' }
      );
    }

    return columns;

  }),
  exportsDepartmentsMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'product_code' },
      { key: 'product_name_short_es', copy: 'product' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_rca' },
      { key: 'export_num_plants' },
      { key: 'distance' }
     ];
    return columns;

  }),
  importsDepartmentsMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'product_code' },
      { key: 'product_name_short_es', copy: 'product' },
      { key: 'year' },
      { key: 'import_value' },
      { key: 'import_rca' },
      { key: 'import_num_plants' },
      { key: 'distance' },

      //
      //{ key: 'rca' },

      //{ key: 'cog' }
     ];



    return columns;

  }),
  exportsCitiesMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'parent.location' },
      { key: 'product_code' },
      { key: 'product_name_short_es', copy: 'product' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_rca' },
      { key: 'export_num_plants' },
      { key: 'distance' },
     ];



    return columns;

  }),
  importsCitiesMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'parent.location' },
      { key: 'product_code' },
      { key: 'product_name_short_es', copy: 'product' },
      { key: 'year' },
      { key: 'import_value' },
      { key: 'import_rca' },
      { key: 'import_num_plants' },
      { key: 'distance' },
     ];



    return columns;

  }),
  occupationsMap: [
    { key: 'code' },
    { key: 'name', copy: 'occupation' },
    { key: 'average_wages' },
    { key: 'share' }
  ],
  livestockMap: [
    { key: 'name', copy: 'livestock' },
    { key: 'num_farms' },
    { key: 'num_livestock' },
  ],
  livestockLocationsMap: computed('source', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'department' },
      { key: 'num_farms' },
      { key: 'num_livestock' },
    ];

    if(this.get('source') === "departments") {
      return _.filter(columns, function(x){ return x.key !== "parent_name"; });
    } else {
      return columns;
    }
  }),
  agproductsMap: [
    { key: 'name', copy: 'agproduct' },
    { key: 'year' },
    { key: 'land_sown' },
    { key: 'land_harvested' },
    { key: 'production_tons' },
    { key: 'yield_ratio' },
    { key: 'yield_index' }
  ],
  agproductLocationsMap: computed('source', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'department' },
      { key: 'year' },
      { key: 'land_sown' },
      { key: 'land_harvested' },
      { key: 'production_tons' },
      { key: 'yield_ratio' },
      { key: 'yield_index' }
    ];

    if(this.get('source') === "departments") {
      return _.filter(columns, function(x){ return x.key !== "parent_name"; });
    } else {
      return columns;
    }
  }),
  nonagsMap: [
    { key: 'name', copy: 'nonag' },
    { key: 'num_farms' },
    { key: 'num_farms_ag' },
    { key: 'num_farms_nonag' },
  ],
  nonagLocationsMap: computed('source', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'department' },
      { key: 'num_farms' },
      { key: 'num_farms_ag' },
      { key: 'num_farms_nonag' },
    ];

    if(this.get('source') === "departments") {
      return _.filter(columns, function(x){ return x.key !== "parent_name"; });
    } else {
      return columns;
    }
  }),
  landUsesMap: [
    { key: 'name', copy: 'land_use' },
    { key: 'area' },
  ],
  landUseLocationsMap: computed('source', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'parent_name', copy: 'department' },
      { key: 'area' },
    ];

    if(this.get('source') === "departments") {
      return _.filter(columns, function(x){ return x.key !== "parent_name"; });
    } else {
      return columns;
    }
  }),
  farmtypesMap: [
    { key: 'name', copy: 'farmtype' },
    { key: 'num_farms' },
  ],
  partnersMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'country' },
      { key: 'parent', copy: 'parent.country' },
      { key: 'export_value' },
      { key: 'year' }
    ];

    if(this.get('featureToggle.showImports')) {
      return columns.concat({key: 'import_value'});
    } else {
      return columns;
    }
  }),
  livestockDataMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'name', copy: 'livestock' },
      { key: 'num_farms' },
      { key: 'num_livestock' },
    ];
    return columns;
  }),
  partnersExportsMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'name', copy: 'country' },
      { key: 'parent', copy: 'parent.country' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'import_value' },
    ];

    return columns;
  }),
  exportPartnersMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'country' },
      { key: 'parent', copy: 'parent.country' },
      { key: 'product_code' },
      { key: 'product_name_short_es', copy: 'product' },
      { key: 'year' },
      { key: 'export_value' }
    ];

    return columns;
  }),
  importPartnersMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'country' },
      { key: 'parent', copy: 'parent.country' },
      { key: 'product_code' },
      { key: 'product_name_short_es', copy: 'product' },
      { key: 'year' },
      { key: 'import_value' }
    ];

    return columns;
  }),
  departmentRankingsMap: computed('featureToggle.showIndustries', function() {
    let columns = [
      { key: 'name' },
      { key: 'year' },
      { key: 'eci' },
      { key: 'coi' },
      { key: 'yield_index' },
      { key: 'gdp_pc_real' },
      { key: 'gdp_real' },
      { key: 'population' },
    ];

    if(this.get('featureToggle.showIndustries')) {
      columns.splice(4, 0, {key: 'industry_eci'});
      columns.splice(5, 0, {key: 'industry_coi'});
    }

    return columns;
   }),
  msaRankingsMap: computed('featureToggle.showIndustries', function() {
    let columns = [
      { key: 'name' },
      { key: 'year' },
      { key: 'eci' },
      { key: 'coi' },
    ];

    if(this.get('featureToggle.showIndustries')) {
      columns.splice(4, 0, {key: 'industry_eci'});
      columns.splice(5, 0, {key: 'industry_coi'});
    }

    return columns;
   })

});

