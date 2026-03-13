/**
 * Checks if a whitespace is needed before a "%" unit dependently on a locale
 * @param {FrontendLocaleData} localeOptions Object containing
 * a user-selected language and formatting
 * @returns {string} Whitespace if needed before "%", empty otherwise
 */
const blankBeforePercent = (localeOptions) => {
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
