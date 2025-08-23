export const filterObject = (
  object: object,
  predicate: (key: string) => boolean,
) => {
  return Object.keys(object).reduce((acc, key) => {
    if (predicate(key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
};
