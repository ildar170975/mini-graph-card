/**
 * HA Frontend number format settings
 */
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
Added here for a future need; now - for understaning what FrontendLocaleData is

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

/**
 * Returns a possible language/languages based on a number format
 * @param {FrontendLocaleData} localeOptions Object containing
 * a user-selected language and formatting settings
 * @returns {string | string[] | undefined} Possible language/languages
 */
const numberFormatToLocale = (localeOptions) => {
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
 * @param {string | number} num Number to format
 * @param {Intl.NumberFormatOptions} options Intl.NumberFormatOptions
 * that should be included in the returned options
 * @returns {Intl.NumberFormatOptions} Default options for Intl.NumberFormat
 */
const getDefaultFormatOptions = (
  num,
  options,
) => {
  const defaultOptions = {
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
 * Returns an array of objects containing the formatted number in parts.
 * Similar to Intl.NumberFormat.prototype.formatToParts()
 * @param {string | number} num Number to format
 * @param {FrontendLocaleData} localeOptions Object containing
 * a user-selected language and formatting settings
 * @param {Intl.NumberFormatOptions} options Intl.NumberFormatOptions to use
 */
const formatNumberToParts = (
  num,
  localeOptions,
  options,
) => {
  const locale = localeOptions
    ? numberFormatToLocale(localeOptions)
    : undefined;

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
 * @param {string | number} num Number to format
 * @param {FrontendLocaleData} localeOptions Object containing
 * a user-selected language and formatting settings
 * @param {Intl.NumberFormatOptions} options Intl.NumberFormatOptions to use
 * @returns {string} Formatted number
 */
const formatNumber = (
  num,
  localeOptions,
  options,
) => formatNumberToParts(num, localeOptions, options)
  .map(part => part.value)
  .join('');

export {
  formatNumber,
};
