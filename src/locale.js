// This function is taken from HA Frontend
/**
 * Check if a whitespace is needed before a "%" unit dependently on a locale
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @returns {string} Whitespace if needed before "%", empty otherwise
 */
const blankBeforePercent = (
  localeOptions, // FrontendLocaleData
) => {
  switch (localeOptions.language) {
    case 'cs':
    case 'de':
    case 'fi':
    case 'fr':
    case 'sk':
    case 'sv':
      return ' ';
    default:
      return '';
  }
};

export {
  blankBeforePercent,
};
