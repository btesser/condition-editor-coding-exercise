export function isEqual(a, b) {
  return a === b;
}

export function isGreaterThan(a, b) {
  return a > b;
}

export function isLessThan(a, b) {
  return a < b;
}

export function hasAnyValue(a) {
  return a !== undefined;
}

export function hasNoValue(a) {
  return a === null || a === undefined || (typeof a === 'string' && !a.length);
}

export function isAnyOf(needle, haystack) {
  const valuesArray = haystack.split(/\,/).map(string => string.trim());
  console.log(valuesArray);
  return valuesArray.indexOf(needle) !== -1;
}

export function contains(haystack, needle) {
  console.log(needle, haystack);
  return haystack.indexOf(needle) !== -1;
}
