const deepkey = require('deep-key');

function enumLeafsDescendingly(obj) {
  return deepkey.keys(obj, { leaf: true, noindex: true })
    .sort((l, r) => r.length - l.length);
}
function findPresentAncestor(obj, key) {
  var k = key.slice();
  while (k.length > 0 && !deepkey.exists(obj, k))
    k.splice(-1);
  return k;
}
function injectable(obj, key, solver) {
  var k = findPresentAncestor(obj, key);
  var i = k.length === 0 || Object.isExtensible(deepkey.get(obj, k));
  if (solver && !i)
    solver(obj, k, deepkey.get(obj, k));
  return i;
}
module.exports = function(a, b) {
  var c = {};
  var keypairs = enumLeafsDescendingly(b)
    .map(k => [ k, findPresentAncestor(a, k) ]);
  for (pair of keypairs) {
    if (injectable(c, pair[0])) {
      if (pair[0].length === pair[1].length)
        deepkey.set(c, pair[0], deepkey.get(a, pair[0]));
      else
        deepkey.set(c, pair[0], undefined);
    }
    var v = deepkey.get(b, pair[0]);
    if (v === undefined)
      deepkey.delete(a, pair[0]);
    else {
      injectable(a, pair[0], (o, k, v) => {
        deepkey.delete(o, k);
        deepkey.set(c, k, v);
      });
      deepkey.set(a, pair[0], v);
    }
  }
  return c;
}
