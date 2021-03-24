import { ElementRef } from '@angular/core';

export const SVG_MATRIX_TRANSFORMATION = (
  svg: SVGSVGElement,
  x: number,
  y: number
): DOMPoint => {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;

  return pt.matrixTransform(svg.getScreenCTM()?.inverse());
};
