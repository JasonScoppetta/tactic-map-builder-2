export const svgMatrixToTransformString = (matrix: SVGMatrix) => {
  const { a, b, c, d, e, f } = matrix;
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
};
