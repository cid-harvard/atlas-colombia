import ENV from '../config/environment';
import numeral from 'numeral';

export function initialize(instance) {
  var i18n = instance.container.lookup('service:i18n');
  var defaultLocale = ENV.defaultLocale;
  var otherLocale = ENV.otherLocale;

  _.each([defaultLocale, otherLocale], (locale) => {
    i18n.set('locale', locale);
    numeral.language(locale, {
      currency: {
        symbol: i18n.t('currency'),
      },
      delimiters: {
        thousands: i18n.t('thousands_delimiter'),
        decimal: i18n.t('decimal_delmiter')
      },
      abbreviations: {
        thousand: i18n.t('abbr_thousand'),
        million: i18n.t('abbr_million'),
        billion: i18n.t('abbr_billion'),
        trillion: i18n.t('abbr_trillion'),
      }
    });
  });

  i18n.set('defaultLocale', defaultLocale);
  i18n.set('otherLocale', otherLocale);
  i18n.set('locales', [otherLocale, defaultLocale]);
  i18n.set('display', i18n.get('locale').split('-')[0]);
  i18n.set('country', i18n.get('locale').split('-')[1]);

  const center = i18n.t('geomap.center')
    .string.split(",")
    .map(function(d) { return parseFloat(d); });

  const lastYear = parseInt(i18n.t('last_year').string);
  const firstYear = parseInt(i18n.t('first_year').string);
  const censusYear = parseInt(i18n.t('census_year').string);

  i18n.set('mapCenter', center);
  i18n.set('lastYear', lastYear);
  i18n.set('firstYear', firstYear);
  i18n.set('censusYear', censusYear);

  i18n.addObserver('locale', function() {
    if(this.get('locale') != 'no-copy') {
      numeral.language(this.get('locale'));
      this.set('display', this.get('locale').split('-')[0]);
      this.set('country', this.get('locale').split('-')[1]);
    }
  });
}

export default {
  name: 'i18n',
  initialize: initialize
};

