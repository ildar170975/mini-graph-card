import { interpolateRgb } from 'd3-interpolate';

export default (start, end, y) => {
  if (typeof start === "string") {
    
  }
  return interpolateRgb(start, end)(y);
};

const isCssVar (value) {
  
}
