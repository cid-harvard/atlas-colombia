import Ember from 'ember';
import TableMap from '../mixins/table-map';
const {computed} = Ember;

export default Ember.Component.extend(TableMap, {
  i18n: Ember.inject.service(),
  fileName: computed('name', 'pageTitle', function() {
    return _.deburr(`${this.get('name')} ${this.get('pageTitle')}`).replace(/[^a-z0-9]+/gi," ").trim();
  }),
  tableMap: computed('source', function() {
    let source = this.get('source');
    let map = this.get(`${source}Map`);
    return map;
  }),
  actions: {
    save: function() {
      let data = _.map(this.get('data'), (datum) => {
        const tableMap = this.get('tableMap');

        return _.reduce(tableMap, (memo, mapping) => {
          let key  = _.get(mapping, 'key');
          let copy = _.get(mapping, 'copy');
          let value = _.get(datum, key);

          if(key  === 'name') {
            value = _.get(datum, `name_short_${this.get('i18n').display}`);
          }
          if (key === 'parent') {
            value = _.get(datum, `parent_name_${this.get('i18n').display}`);
          }

          let tableHeader = copy ? `graph_builder.download.${copy}`: `graph_builder.download.${key}`;

          memo[this.get('i18n').t(tableHeader).string] = value;

          return memo;
        },{});

      });

      let csv = Papa.unparse(data);

      this.set('csv',_.deburr(csv));

      var formBlob = new Blob([this.get('csv')], { type: 'text/csv' });
      this.set('formBlob', formBlob);
      saveAs(this.get('formBlob'), this.get('fileName'));
    }
  }
});
