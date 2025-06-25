import { interpolateRgb } from 'd3-interpolate';

export default (start, end, y) => {
  const _start = isAssumingCssVar(start)
    ? convertCssVarToColor(start)
    : start;
  const _end = isAssumingCssVar(end)
    ? convertCssVarToColor(end)
    : end;
  return interpolateRgb(_start, _end)(y);
};
