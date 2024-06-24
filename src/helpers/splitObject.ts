import { getObjectKeys } from "@/helpers/getObjectKeys";

export function splitObject<T, K extends keyof T>(
  obj: T,
  keys: K[],
): [Pick<T, K>, { [P in Exclude<keyof T, K>]: T[P] }] {
  const included: Partial<Pick<T, K>> = {};
  const excluded: Partial<{ [P in Exclude<keyof T, K>]: T[P] }> = {};

  getObjectKeys(obj as object).forEach((key) => {
    if (keys.includes(key as K)) {
      included[key as K] = obj[key];
    } else {
      excluded[key as Exclude<keyof T, K>] = obj[key];
    }
  });

  return [
    included as Pick<T, K>,
    excluded as { [P in Exclude<keyof T, K>]: T[P] },
  ];
}
