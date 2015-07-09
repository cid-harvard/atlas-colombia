import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  filteredData: computed('data', function() {
    return this.get('data');
  }),
  treemap: computed('id','data',function() {
    return  vistk.viz()
      .container(this.get('id'))
      .params({
        type: "treemap",
        container: this.get('id'),
        height: this.get('height'),
        width: this.get('width'),
        margin: {top: 0, right: 0, bottom: 0, left: 0},
        data: this.get('filteredData'),
        var_id: this.get('varId'),
        var_group: this.get('varGroup'),
        var_size: this.get('varSize'),
        var_sort: this.get('varSort'),
        var_text: this.get('varText'),
        color: function() { return "#EAE6E3"; }
      });
  }),
  draw: function() {
    this.set('width', this.$().parent().width());
    this.set('height', this.$().parent().height());
    d3.select(this.get('id'))
      .call(this.get('treemap'));
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.draw();
    });
  },
  didDataChange: observer('data', function() {
    this.rerender();
  })
});

