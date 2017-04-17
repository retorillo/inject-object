'use strict';

const should = require('should');
const inject = require('../');

var testCases = [
  // a: Object to be injected
  // b: Object to inject
  // c: Expected object after injection
  // d: Expected return value
  { 
    a: {}, 
    b: { foo: 'bar' }, 
    c: { foo: 'bar' }, 
    d: { foo: undefined },
  },
  { 
    a: { foo: 'bar' }, 
    b: { foo: undefined }, 
    c: { }, 
    d: { foo: 'bar' },
  },
  {
    a: { foo: 'bar', baz: 'foobar' },
    b: { foo: 'baz' },
    c: { foo: 'baz', baz: 'foobar' },
    d: { foo: 'bar' }
  },
  {
    a: { foo: { bar: { baz: 'foobar' } } },
    b: { foo: 'foobar' },
    c: { foo: 'foobar'  },
    d: { foo: { bar: { baz: 'foobar' } } }
  },
  {
    a: { a: { b: { c: 'foo' } }, d: 'bar' },
    b: { a: { b: { c: { d: 'baz' } } } },
    c: { a: { b: { c: { d: 'baz' } } }, d: 'bar'},
    d: { a: { b: { c: 'foo' } } }
  },
  { 
    a: { a: 'b', h: { i: 'j' } }, 
    b: { a: { b: 'c', d: { e: 'd' } }, f: 'g' }, 
    c: { a: { b: 'c', d: { e: 'd' } }, f: 'g', h: { i: 'j' } }, 
    d: { a: 'b', f: undefined },
  },
  { 
    a: { a: { b: 0, c: 1 } }, 
    b: { a: { d: 2, e: 3 } }, 
    c: { a: { b: 0, c: 1, d: 2, e: 3 } }, 
    d: { a: { d: undefined, e: undefined } },
  },
]

// exactStringify from https://github.com/retorillo/deep-key (125ced8)
function exactStringify(obj) {
  if (obj === undefined) return 'undefined';
  else if (obj === null) return 'null';
  else if (typeof(obj) === 'number') return obj.toString();
  else if (typeof(obj) === 'object') {
    var str = [ '{' ];
    for (var k of Object.getOwnPropertyNames(obj).sort()) {
      if (str.length > 1)
        str.push(',')
      str.push(`${k}:${exactStringify(obj[k])}`);
    }
    str.push('}');
    return str.join('');
  }
  else return ["'", obj.toString().replace(/'/g, "\\'"), "'"].join('');
  // TODO: handle another metacharacters:  \n \r \t ...
}


describe('Injection' , function() {
  for (let test of testCases) {
    context(`${exactStringify(test.a)} <= ${exactStringify(test.b)}`,
      function() {
        let d, astr, dstr;
        before(function() {
          d = inject(test.a, test.b);
          astr = exactStringify(test.a);
          dstr = exactStringify(d);
        });
        it(`Should be ${exactStringify(test.c)}`, function() {
          should(astr).eql(exactStringify(test.c));
        });
        it(`Should return ${exactStringify(test.d)}`, function() {
          should(dstr).eql(exactStringify(test.d));
        });
    });
  }
});
describe('Restoration' , function() {
  for (let test of testCases) {
    context(`${exactStringify(test.a)} <=> ${exactStringify(test.b)}`,
      function() {
        let a, d;
        before(function() {
          a = JSON.parse(JSON.stringify(test.a));
          d = inject(a, test.b);
        });
        inject(a, d);
        it(`Should restore to ${exactStringify(test.a)}`, function() {
          should(a).eql(test.a);
        });
    });
  }
});
