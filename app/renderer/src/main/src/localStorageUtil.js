let ls = window.localStorage;

function get(key) {
  if (!key) {
    return;
  }
  let result = ls.getItem(key);
  try {
    if (result) {
      result = JSON.parse(result);
    }
  } catch (e) {}
  return result;
}

function set(key, value) {
  if (!key) {
    return;
  }
  if (value && typeof value === "object") {
    value = JSON.stringify(value);
  }
  ls.setItem(key, value);
}

function remove(key) {
  if (!key) {
    return;
  }
  ls.removeItem(key);
}

export default { get, set, remove };
