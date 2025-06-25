import { interpolateRgb } from 'd3-interpolate';

const isAssumingCssVar = value => (typeof value === 'string' && value.trim().startsWith('var(--'));

const convertCssVarToColor = (value) => {
  const name = value.trim().replace('var(', '').replace(')', '');
  let element = document.querySelector('ha-card'); // eslint-disable-line no-undef
  if (!element)
    element = document.body; // eslint-disable-line no-undef
  return window
    ? window.getComputedStyle(element).getPropertyValue(name)
    : '#000000';
};

export default (start, end, y) => {
  const _start = isAssumingCssVar(start)
    ? convertCssVarToColor(start)
    : start;
  const _end = isAssumingCssVar(end)
    ? convertCssVarToColor(end)
    : end;
  return interpolateRgb(_start, _end)(y);
};
