// this var was converted from TS enum from HA frontend
const TimeFormat = Object.freeze({
  language: 'language',
  system: 'system',
  am_pm: '12',
  twenty_four: '24',
});

/**
 * Get "24h/12h" hour format dependently on HA Frontend settings
 * @param {object} locale HA Frontend local regional settings
 * @returns {boolean} true: "24h" format, false: "12h" format
 */
const getHour24 = locale => {
  if ([TimeFormat.language, TimeFormat.system].includes(locale.time_format)) {
    const testLanguage = locale.time_format === TimeFormat.language
      ? locale.language
      : undefined;
    const test = new Date('January 1, 2020 22:00:00').toLocaleString(testLanguage);
    return !test.includes('10');
  }
  return locale.time_format === TimeFormat.twenty_four;
};

/**
 * Get hour format dependently on "hour24" boolean
 * @param {boolean} hour24 If "24h" time format should be used
 * @returns {object} Hour format
 */
const getHourFormat = hour24 => (hour24 ? { hourCycle: 'h23' } : { hour12: true });

/**
 * Get date format if needed (when "hours_to_show" > 24)
 * @param {object} config Card config
 * @returns {object} Date format
 */
const getDateFormat = config => config.hours_to_show > 24 ? { day: 'numeric', weekday: 'short' } : {};

export {
  getHour24,
  getHourFormat, getDateFormat,
};
