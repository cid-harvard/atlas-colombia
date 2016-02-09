import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  downloadURL: `${ENV.downloadURL}/production`,
  mapURL: ENV.mapURL
});

