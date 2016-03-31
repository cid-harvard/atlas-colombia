import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  renderTemplate() {
    this.render({ outlet: 'homepage' });
  },
  model() {
    let hash = {
     locations: this.store.find('location'),
     products: this.store.find('product', { level: '4digit' }),
     industries: this.store.find('industry', { level: 'division' })
    };

    return RSVP.hash(hash).then((hash) => {
      let {industries, products, locations} = hash;
      return Object.create({
        industries: industries,
        products: products,
        locations: locations
      });
    });
  },
  deactivate() {
    this._super.apply(this,arguments);
    window.scrollTo(0,0);
  }
});

