import Ember from 'ember';
import numeral from 'numeral';
import ColumnDefinition from 'ember-table/models/column-definition';
import EmberTableComponent from 'ember-table/components/ember-table';
import HeaderCell from 'ember-table/views/header-cell';
import TableCell from 'ember-table/views/table-cell';

const { computed, observer } = Ember;

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
  templateName: 'sortable-cell'
});

var SortableColumnMixin = Ember.Object.create({
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
  minHeaderHeight: 50,
  height: 400,
  enableContentSelection: true,
  attributeBindings: ['height'],
  selectionMode: 'mutiple',
  industryClassesMap: [
    { key: 'code', expand: false, savedWidth: 100 },
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'avg_wage', expand: false, savedWidth: 200 },
    { key: 'wages', type: 'int', expand: true },
    { key: 'employment', expand: true, savedWidth: 200 },
    { key: 'employment_growth', expand: true, savedWidth: 300 },
    { key: 'num_establishments', expand: true, savedWidth: 200 },
  ],
  productsMap: [
    { key: 'code', expand: false, savedWidth: 100 },
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'parent', expand: true, savedWidth: 300 },
    { key: 'year' , expand: false, savedWidth: 100 },
    { key: 'export_value', type: 'int', expand: true, savedWidth: 140 },
    { key: 'import_value', type: 'int', expand: true, savedWidth: 140 },
    { key: 'export_rca', type: 'int', expand: true, savedWidth: 160 },
    { key: 'complexity' , expand: false, type: 'int', savedWidth: 120 },
    { key: 'distance' , expand: true, type: 'int', savedWidth: 120 }
   ],
  locationsMap: [
    { key: 'code', expand: false, savedWidth: 100 },
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'year' , expand: false, type: 'int', savedWidth: 100 },
    { key: 'export_value', type: 'int', expand: true, savedWidth: 140 },
    { key: 'import_value', type: 'int', expand: true, savedWidth: 140 },
    { key: 'export_rca', type: 'int', expand: true, savedWidth: 160 },
   ],
  industriesMap: [
    { key: 'code', expand: false, savedWidth: 100 },
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'parent', expand: true, savedWidth: 300 },
    { key: 'year' , expand: false, type: 'int', savedWidth: 100 },
    { key: 'wages', type: 'int', expand: true},
    { key: 'employment', type: 'int', expand: false},
    { key: 'rca', type: 'int', expand: true},
    { key: 'complexity' , expand: false, type: 'int'}
   ],
  departmentsMap: [
    { key: 'code', expand: false, savedWidth: 100 },
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'year' , expand: false, type: 'int', savedWidth: 100 },
    { key: 'wages', type: 'int', expand: true},
    { key: 'employment', type: 'int', expand: false},
    { key: 'num_establishments', type: 'int', expand: false},
   ],
  occupationsMap: [
    { key: 'name', expand: true, savedWidth: 200 },
    { key: 'code', expand: false },
    { key: 'average_wages', type: 'int', expand: true },
    { key: 'num_vacancies', type: 'int', expand: true },
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
    this.set('content', []);
    this.set('content', this.get('data'));
  }),
  generateColumnDefinition: function(column) {
    return ColumnDefinition.create(SortableColumnMixin, {
      canAutoResize: column.expand,
      textAlign: column.type === 'int' ? 'text-align-right' : 'text-align-left',
      savedWidth: column.savedWidth ? column.savedWidth : 160,
      headerCellName: `graph_builder.table.${column.key}`,
      getCellContent: this.generateCellContent(column),
      isResizable: true,
      isNumber: '1',
      key: column.key
    });
  },
  generateCellContent: function(column) {
    return (row) => {
      if(_.isNumber(row.get(column.key))){
        let number = row.get(column.key);
        return this.formatNumber(number, column.key);
      } else if(column.key === 'name'){
        return row.get(`name_short_${this.get('i18n').locale}`);
      } else if(column.key === 'parent'){
        // Forgive me, Father
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
  formatNumber: function(number, key) {
    if(key === 'wages' || key === 'avg_wage' || key === 'average_wages') {
      return numeral(number).divide(1000).format('0,0');
    } else if(key === 'export_rca' || key === 'rca' || key === 'complexity' || key === 'distance' || key === 'population'){
      return numeral(number).format('0.00a');
    } else if(key === 'employment'){
      return numeral(Math.ceil(number)).format('0,0');
    } else if(key === 'num_establishments'){
      if(parseInt(number) < 6) { return ' < 5'; }
      return numeral(number).format('0,0');
    } else if(key === 'employment_growth'){
      return numeral(number).format('0.00%');
    } else if(key === 'export_value' || key === 'import_value') {
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

