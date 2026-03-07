// this var was converted from TS enum from HA frontend
const TimeFormat = Object.freeze({
  language: 'language',
  system: 'system',
  am_pm: '12',
  twenty_four: '24',
});

const getHour24 = (locale) => {
  if ([TimeFormat.language, TimeFormat.system].includes(locale.time_format)) {
    const testLanguage = locale.time_format === TimeFormat.language
      ? locale.language
      : undefined;
    const test = new Date('January 1, 2020 22:00:00').toLocaleString(testLanguage);
    return !test.includes('10');
  }
  return locale.time_format === TimeFormat.twenty_four;
};

const getHourFormat = hour24 => (hour24 ? { hourCycle: 'h23' } : { hour12: true });

export {
  getHour24,
  getHourFormat,
};

