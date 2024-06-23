export const getEnumKeys = <O extends object, K extends keyof O = keyof O>(
  obj: O,
  allowNaN = false,
): K[] => {
  return Object.keys(obj).filter((k) =>
    allowNaN ? k : Number.isNaN(+k),
  ) as K[];
};

export const getObjectKeys = getEnumKeys;
