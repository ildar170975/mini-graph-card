import { interpolateRgb } from 'd3-interpolate';

const isAssumingCssVar = color => (typeof color === 'string' && color.trim().startsWith('var(--'));

const convertCssVarToColor = color => getComputedStyle(document.documentElement).getPropertyValue(color);

export default (start, end, y) => {
  if (isAssumingCssVar(start)) {
    start = convertCssVarToColor(start);
  }
  if (isAssumingCssVar(end)) {
    end = convertCssVarToColor(end);
  }
  return interpolateRgb(start, end)(y);
};
