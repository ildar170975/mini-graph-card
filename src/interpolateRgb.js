import { interpolateRgb } from 'd3-interpolate';

const isAssumingCssVar = color => (typeof color === 'string' && color.trim().startsWith('var(--'));

const convertCssVarToColor = color => window
  .getComputedStyle(document.querySelector(':host'))
  .getPropertyValue(color);

export default (start, end, y) => {
  const _start = isAssumingCssVar(start)
    ? convertCssVarToColor(start)
    : start;
  const _end = isAssumingCssVar(end)
    ? convertCssVarToColor(end)
    : end;
  return interpolateRgb(_start, _end)(y);
};
