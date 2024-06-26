export const isValidNumber = (value: string | number): boolean => {
  return !isNaN(Number(value));
};
