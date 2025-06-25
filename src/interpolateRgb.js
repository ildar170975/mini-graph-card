import { interpolateRgb } from 'd3-interpolate';

export default (start, end, y) => interpolateRgb(start, end)(y);
