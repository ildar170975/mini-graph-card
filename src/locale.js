// fragment of format_number.ts from HA frontend converted to JS

// this var was converted from TS enum
/* must be uncommented before merging with https://github.com/kalkih/mini-graph-card/pull/1347
const TimeFormat = Object.freeze({
  language: 'language',
  system: 'system',
  am_pm: '12',
  twenty_four: '24',
});
*/

// this var was converted from TS enum
const NumberFormat = Object.freeze({
  language: 'language',
  system: 'system',
  comma_decimal: 'comma_decimal',
  decimal_comma: 'decimal_comma',
  quote_decimal: 'quote_decimal',
  space_comma: 'space_comma',
  none: 'none',
});

/* these types are used in FrontendLocaleData
export enum TimeZone {
  local = 'local',
  server = 'server',
}

export enum DateFormat {
  language = 'language',
  system = 'system',
  DMY = 'DMY',
  MDY = 'MDY',
  YMD = 'YMD',
}

export enum FirstWeekday {
  language = 'language',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}
*/

/* this type is used for hass.locale
export interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
  time_format: TimeFormat;
  date_format: DateFormat;
  first_weekday: FirstWeekday;
  time_zone: TimeZone;
}
*/

const numberFormatToLocale = (
  localeOptions, // FrontendLocaleData
) /* : string | string[] | undefined */ => {
  switch (localeOptions.number_format) {
    case NumberFormat.comma_decimal:
      return ['en-US', 'en']; // Use United States with fallback to English formatting 1,234,567.89
    case NumberFormat.decimal_comma:
      return ['de', 'es', 'it']; // Use German with fallback to Spanish then Italian formatting 1.234.567,89
    case NumberFormat.space_comma:
      return ['fr', 'sv', 'cs']; // Use French with fallback to Swedish and Czech formatting 1 234 567,89
    case NumberFormat.quote_decimal:
      return ['de-CH']; // Use German (Switzerland) formatting 1'234'567.89
    case NumberFormat.system:
      return undefined;
    default:
      return localeOptions.language;
  }
};

/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
const getDefaultFormatOptions = (
  num, // string | number
  options, // Intl.NumberFormatOptions
) => {
  const defaultOptions = { // Intl.NumberFormatOptions
    maximumFractionDigits: 2,
    ...options,
  };

  if (typeof num !== 'string') {
    return defaultOptions;
  }

  // Keep decimal trailing zeros if they are present in a string numeric value
  if (
    !options
    || (options.minimumFractionDigits === undefined
        && options.maximumFractionDigits === undefined)
  ) {
    const digits = num.indexOf('.') > -1 ? num.split('.')[1].length : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }

  return defaultOptions;
};

/**
 * Returns an array of objects containing the formatted number in parts
 * Similar to Intl.NumberFormat.prototype.formatToParts()
 *
 * Input params - same as for formatNumber()
 */
const formatNumberToParts = (
  num, // string | number
  localeOptions, // FrontendLocaleData (optional)
  options, // Intl.NumberFormatOptions (optional)
) => {
  const locale = localeOptions
    ? numberFormatToLocale(localeOptions)
    : undefined;

  // Polyfill for Number.isNaN, which is more reliable than the global isNaN()
  Number.isNaN = Number.isNaN
    || function isNaN(input) {
      return typeof input === 'number' && isNaN(input);
    };

  if (
    localeOptions
    && localeOptions.number_format !== NumberFormat.none
    && !Number.isNaN(Number(num))
  ) {
    return new Intl.NumberFormat(
      locale,
      getDefaultFormatOptions(num, options),
    ).formatToParts(Number(num));
  }

  if (
    !Number.isNaN(Number(num))
    && num !== ''
    && localeOptions
    && localeOptions.number_format === NumberFormat.none
  ) {
    // If NumberFormat is none, use en-US format without grouping.
    return new Intl.NumberFormat(
      'en-US',
      getDefaultFormatOptions(num, {
        ...options,
        useGrouping: false,
      }),
    ).formatToParts(Number(num));
  }

  return [{ type: 'literal', value: num }];
};

/**
 * Formats a number based on the user's preference with thousands separator(s)
 * and decimal character for better legibility.
 *
 * @param num The number to format
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
const formatNumber = (
  num, // string | number
  localeOptions, // FrontendLocaleData (optional)
  options, // Intl.NumberFormatOptions (optional)
) => formatNumberToParts(num, localeOptions, options)
  .map(part => part.value)
  .join('');

export {
  formatNumber,
};
