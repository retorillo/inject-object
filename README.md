# inject-object

[![Build Status](https://travis-ci.org/retorillo/inject-object.svg?branch=master)](https://travis-ci.org/retorillo/inject-object)
[![Coverage Status](https://coveralls.io/repos/github/retorillo/inject-object/badge.svg?branch=master)](https://coveralls.io/github/retorillo/inject-object?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/retorillo/inject-object.svg)](https://gemnasium.com/github.com/retorillo/inject-object)
[![NPM](https://img.shields.io/npm/v/inject-object.svg)](https://www.npmjs.com/package/inject-object)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Inject object members to another object.

```javascript
const inject = require('inject-object');
var object1 = { a: 'b', c: 'd' } }
var object2 = { c: { d: { e: 'f' }} }

var purged = inject(object1, object2);

// object1 === { a: 'b', c: { d: {e : 'f'} } }
// purged  === { c: 'd' }
```

## Remove members

When `undefined` is specified, removes members rather than injection.

```javascript
var object1 = { a: 'b' }
var object2 = { a: undefined }
var purged = inject(object1, object2);

// object1 === { }
// purged  === { a: 'b' }
```

## Restore members

Return value can be used to restore members from injections.

```javascript
var object1 = { a: 'b', c: 'd', f: 'g' }
var object2 = { a: undefined, c: { d: 'e' }, }
var purged = inject(object1, object2);

// object1 === { c: { d: 'e' }, f: 'g' }
// purged  === { a: 'b', c: 'd' }

inject(object1, purged)

// object1 === { a: 'b', c: 'd', 'f': 'g' }
```

## License

MIT License

(C) 2017 Retorillo
