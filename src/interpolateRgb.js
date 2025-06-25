import { interpolateRgb } from 'd3-interpolate';

interpolateRgbExtended(start, end, y) {
  return interpolateRgb(start, end)(y);
}

export { interpolateRgbExtended as default };
