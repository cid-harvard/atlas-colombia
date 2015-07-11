import DS from 'ember-data';
const {attr} = DS;

export default DS.Model.extend({
  code: attr('number', { defaultValue: 111}),

  name_en: attr('string'),
  name_es: attr('string'),

  name_short_en: attr('string'),
  name_short_es: attr('string'),

  description_en: attr('string'),
  description_es: attr('string'),

  level: attr('string'),

  parent_id: attr('string')
});