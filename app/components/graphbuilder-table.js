import Ember from 'ember';
import numeral from 'numeral';
import ColumnDefinition from 'ember-table/models/column-definition';
import EmberTableComponent from 'ember-table/components/ember-table';
import HeaderCell from 'ember-table/views/header-cell';
import TableCell from 'ember-table/views/table-cell';

const { computed,
  observer } = Ember;

var SortableTableHeaderCell = HeaderCell.extend({
  templateName: 'sortable-header-cell',

   // `event` here is a jQuery event
  onColumnResize: function(event, ui) {
    var newWidth = Math.round(ui.size.width);
    if (this.get('tableComponent.columnMode') === 'standard') {
      this.get('column').resize(newWidth);
      this.set('tableComponent.columnsFillTable', false);
    } else {
      var diff = this.get('width') - newWidth;
      this.get('column').resize(newWidth);
      this.get('nextResizableColumn').resize(this.get('nextResizableColumn.width') + diff);
    }

    this.elementSizeDidChange();

    // Trigger the table resize (and redraw of layout) when resizing is done
    if (event.type === 'resizestop') {
      this.get('tableComponent').elementSizeDidChange();
    }

    this.get('tableComponent').sendAction('onColumnResized', this.get('column'), newWidth);
  }

});

var SortableTableCell = TableCell.extend({
  i18n: Ember.inject.service(),
  templateName: 'sortable-cell'
});

var SortableColumnMixin = Ember.Object.create({
  i18n: Ember.inject.service(),
  supportSort: true,
  sorted: 0,
  isAscending: false,
  isDescending: false,
  headerCellViewClass: SortableTableHeaderCell,
  tableCellViewClass: SortableTableCell
});

export default EmberTableComponent.extend({
  i18n: Ember.inject.service(),
  hasFooter: false,
  rowHeight: 50,
  height: 420,
  enableContentSelection: true,
  attributeBindings: ['height'],
  selectionMode: 'mutiple',

  columnSettingsMap: [
    {
      key: 'average_wages',
      type: 'int',
      savedWidth: 270
    }, {
      key: 'avg_wage',
      savedWidth: 130
    }, {
      key: 'code',
      savedWidth: 100
    }, {
      key: 'cog' ,
      type: 'int',
      savedWidth: 200
    }, {
      key: 'complexity' ,
      type: 'int',
      savedWidth: 180
    }, {
      key: 'distance' ,
      type: 'int',
      savedWidth: 100
    }, {
      key: 'employment',
      type: 'int',
      savedWidth: 130
    }, {
      key: 'employment_growth',
      savedWidth: 80
    }, {
      key: 'export_num_plants' ,
      type: 'int',
      savedWidth: 120
    }, {
      key: 'export_rca',
      type: 'int',
      savedWidth: 280
    }, {
      key: 'export_value',
      type: 'int',
      savedWidth: 180
    }, {
      key: 'import_value',
      type: 'int',
      savedWidth: 180
    }, {
      key: 'monthly_wages',
      type: 'int',
      savedWidth: 230
    }, {
      key: 'name',
      copy: 'export',
      savedWidth: 200
    }, {
      key: 'num_establishments' ,
      type: 'int',
      savedWidth: 120
    }, {
      key: 'num_vacancies',
      type: 'int',
      savedWidth: 100
    }, {
      key: 'parent',
      savedWidth: 270
    }, {
      key: 'rca',
      type: 'int',
      savedWidth: 280
    }, {
      key: 'wages',
      type: 'int',
      savedWidth: 370
    }, {
      key: 'year' ,
      type: 'int',
      savedWidth: 80
    }
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
  productsMap: [
    { key: 'code' },
    { key: 'name', copy: 'export' },
    { key: 'parent' },
    { key: 'year' },
    { key: 'export_value' },
    { key: 'import_value' },
    { key: 'export_rca' },
    { key: 'complexity' },
    { key: 'distance' },
    { key: 'cog' }
   ],
  locationsMap: [
    { key: 'code' },
    { key: 'name', copy: 'location' },
    { key: 'year' },
    { key: 'export_value' },
    { key: 'import_value' },
    { key: 'export_num_plants' },
    { key: 'export_rca' },
    { key: 'distance' },
    { key: 'cog' }
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
    { key: 'distance' }
   ],
  departmentsMap: [
    { key: 'code' },
    { key: 'name', copy: 'location' },
    { key: 'year' },
    { key: 'monthly_wages' },
    { key: 'wages' },
    { key: 'num_establishments' },
    { key: 'employment' },
    { key: 'rca' },
    { key: 'distance' },
    { key: 'cog' }
   ],
  occupationsMap: [
    { key: 'code' },
    { key: 'name', copy: 'occupation' },
    { key: 'average_wages' },
    { key: 'num_vacancies' }
  ],
  tableMap: computed('source', function() {
    let source = this.get('source');
    let map = this.get(`${source}Map`);
    if(this.get('isSingleYear')) {
      map = _.reject(map, {key: 'year'});
    }
    return map;
  }),
  columns: computed('tableMap', function() {
    return this.get('tableMap').map((column) => {
      return this.generateColumnDefinition(column);
    });
  }),
  content: computed('data.[]', function() {
    return this.get('data');
  }),
  refreshTable: observer('i18n.locale', function() {
    this.set('content',
      []);
    this.set('content',
      this.get('data'));
  }),
  generateColumnDefinition: function(column) {
    let colSettings = _.find(this.columnSettingsMap, { 'key': column.key });
    return ColumnDefinition.create(SortableColumnMixin, {
      canAutoResize: false,
      textAlign: colSettings.type === 'int' ? 'text-align-right' : 'text-align-left',
      headerCellName: column.copy ? `graph_builder.table.${column.copy}`: `graph_builder.table.${column.key}`,
      getCellContent: this.generateCellContent(column),
      isResizable: true,
      savedWidth: colSettings.savedWidth ? colSettings.savedWidth : 160,
      key: column.key
    });
  },
  generateCellContent: function(column) {
    return (row) => {
      if(_.isNumber(row.get(column.key))){
        let number = row.get(column.key);
        return this.formatNumber(number, column.key, this.get('i18n'));
      } else if(column.key === 'name'){
        return row.get(`name_short_${this.get('i18n').locale}`);
      } else if(column.key === 'parent'){
        let color = row.get('color');
        let testSpan = Ember.String.htmlSafe('<i class="ember-table-color-marker" style=background-color:' + color + '></i>');
        return testSpan + row.get(`parent_name_${this.get('i18n').locale}`);
      } else if(column.key === 'code'){
        return row.get('code');
      } else {
        return 'N/A';
      }
    };
  },
  formatNumber: (number, key, i18n) => {
    var decimal_vars = ['export_rca','rca','complexity', 'distance', 'cog', 'population'];
    var wage_vars = ['wages', 'avg_wages'];

    if(_.include(wage_vars, key)){
      return numeral(number).divide(1000).format('0,0');
    } else if(_.include(decimal_vars, key)){
      return numeral(number).format('0.00a');
    } else if(key === 'employment'){
      return numeral(Math.ceil(number)).format('0,0');
    } else if(key === 'num_establishments' || key === 'export_num_plants'){
      if(parseInt(number) < 6) {
        return i18n.t('graph_builder.table.less_than_5');
      }
      return numeral(number).format('0,0');
    } else if(key === 'employment_growth'){
      return numeral(number).format('0.00%');
    } else if(key === 'export_value' || key === 'import_value' || key === 'monthly_wages') {
      return numeral(number).format('0,0');
    } else {
      return number;
    }
  },
  didInsertElement: function() {
    this._super();
    //FIXME: FLEXBOX!
    this.set('_height', this.get('height'));
  },
  clearSorting: function() {
    let cols = this.get('columns');
    cols.forEach(function(col) {
      col.set('isAscending', false);
      col.set('isDescending', false);
    });
  },
  actions: {
    sortByColumn: function(content){
      let key = content.key;
      this.set('content', []);
      let data;
      if(key === 'name') {
        key = `name_short_${this.get('i18n').locale}`;
      } else if (key === 'parent') {
        key = `parent_name_${this.get('i18n').locale}`;
      }
      var sortFunction = function(d) {
        if(_.isString(d[key])) { return d[key].toLowerCase(); }
        return d[key];
      };

      //  0 unsorted
      //  1 sorted desc
      // -1 sorted asc

      this.clearSorting();

      if(content.get('sorted') === -1) {
        data = _.sortBy(this.get('data'), sortFunction).reverse();
        content.set('isAscending', false);
        content.set('isDescending', true);
        content.set('sorted', 1);
      } else {
        data = _.sortBy(this.get('data'), sortFunction);
        content.set('isAscending', true);
        content.set('isDescending', false);
        content.set('sorted', -1);
      }

      this.set('content', data);
    }
 }
});

