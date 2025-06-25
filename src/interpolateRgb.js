import { interpolateRgb } from 'd3-interpolate';

export default (start, end, y) => {
  return interpolateRgb(start, end)(y);
}
