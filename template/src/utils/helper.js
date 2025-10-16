/**
 * Normalize query parameters for pagination and filters
 * Converts array-like keys (ending with []) to arrays
 * @param {Object} query - req.query
 * @returns {Object} - { limit, page, filters }
 */
export const normalizeQuery = ({ query }) => {
  const filters = {};
  let { limit = 10, page = 1, ...rest } = query;

  limit = parseInt(limit, 10) || 10;
  page = parseInt(page, 10) || 1;

  for (const key in rest) {
    if (key.endsWith('[]')) {
      const newKey = key.slice(0, -2);
      let val = Array.isArray(rest[key]) ? rest[key] : [rest[key]];
      filters[newKey] = val;
    } else {
      filters[key] = rest[key];
    }
  }

  return { limit, page, filters };
};

/**
 * Sort array of objects by a nested key
 * @param {Array} data - Array to sort
 * @param {string} keyPath - Nested key (e.g., 'user.name')
 * @param {boolean} asc - Sort ascending (default true)
 * @returns {Array} - Sorted array
 */
export const sortByNestedKey = ({ data, keyPath, asc = true }) => {
  if (!Array.isArray(data)) return [];

  const keys = keyPath.split('.');

  return [...data].sort((a, b) => {
    const valueA = keys.reduce((obj, key) => obj?.[key], a) ?? '';
    const valueB = keys.reduce((obj, key) => obj?.[key], b) ?? '';

    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();

    if (strA < strB) return asc ? -1 : 1;
    if (strA > strB) return asc ? 1 : -1;
    return 0;
  });
};
