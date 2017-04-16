const deepkey = require('deep-key');

function enumLeafsDescendingly(obj) {
  return deepkey.keys(obj, { leaf: true, noindex: true })
    .sort((l, r) => r.length - l.length);
}
function findPresentAncestorOrRoot(obj, key) {
  var k = key.slice();
  while (k.length > 1 && !deepkey.exists(obj, k))
    k.splice(-1);
  return k;
}
module.exports = function(a, b) {
  var c = {};
  var keypairs = enumLeafsDescendingly(b)
    .map(k => [ k, findPresentAncestorOrRoot(a, k) ]);
  for (pair of keypairs) {
    if (!deepkey.exists(c, pair[1])) {
      var v1 = deepkey.get(a, pair[1]);
      deepkey.set(c, pair[1], v1);
      if (!Object.isExtensible(v1))
        deepkey.delete(a, pair[1]);
    }
    var v2 = deepkey.get(b, pair[0]);
    if (v2 === undefined)
      deepkey.delete(a, pair[0]);
    else
      deepkey.set(a, pair[0], v2);
  }
  return c;
}
