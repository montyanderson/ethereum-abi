const assert = require("assert");
const BN = require("bn.js");
const abi = require("./");

describe('official test vector 1 (encoding)', function () {
  it('should equal', function () {
    var a = abi.methodID('baz', [ 'uint32', 'bool' ]).toString('hex') + abi.rawEncode([ 'uint32', 'bool' ], [ 69, 1 ]).toString('hex')
    var b = 'cdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001'
    assert.equal(a, b)
  })
})

// Homebrew tests

describe('method signature', function () {
  it('should work with test()', function () {
    assert.equal(abi.methodID('test', []).toString('hex'), 'f8a8fd6d')
  })
  it('should work with test(uint)', function () {
    assert.equal(abi.methodID('test', [ 'uint' ]).toString('hex'), '29e99f07')
  })
  it('should work with test(uint256)', function () {
    assert.equal(abi.methodID('test', [ 'uint256' ]).toString('hex'), '29e99f07')
  })
  it('should work with test(uint, uint)', function () {
    assert.equal(abi.methodID('test', [ 'uint', 'uint' ]).toString('hex'), 'eb8ac921')
  })
})


describe('encoding negative int32', function () {
  it('should equal', function () {
    var a = abi.rawEncode([ 'int32' ], [ -2 ]).toString('hex')
    var b = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe'
    assert.equal(a, b)
  })
})

describe('encoding negative int256', function () {
  it('should equal', function () {
    var a = abi.rawEncode([ 'int256' ], [ new BN('-19999999999999999999999999999999999999999999999999999999999999', 10) ]).toString('hex')
    var b = 'fffffffffffff38dd0f10627f5529bdb2c52d4846810af0ac000000000000001'
    assert.equal(a, b)
  })
})

describe('encoding string >32bytes', function () {
  it('should equal', function () {
    var a = abi.rawEncode([ 'string' ], [ ' hello world hello world hello world hello world  hello world hello world hello world hello world  hello world hello world hello world hello world hello world hello world hello world hello world' ]).toString('hex')
    var b = '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c22068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c64202068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c64202068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c642068656c6c6f20776f726c64000000000000000000000000000000000000000000000000000000000000'
    assert.equal(a, b)
  })
})

describe('encoding uint32 response', function () {
  it('should equal', function () {
    var a = abi.rawEncode([ 'uint32' ], [ 42 ]).toString('hex')
    var b = '000000000000000000000000000000000000000000000000000000000000002a'
    assert.equal(a, b)
  })
})

describe('encoding string response (unsupported)', function () {
  it('should equal', function () {
    var a = abi.rawEncode([ 'string' ], [ 'a response string (unsupported)' ]).toString('hex')
    var b = '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001f6120726573706f6e736520737472696e672028756e737570706f727465642900'
    assert.equal(a, b)
  })
})

describe('decoding uint32', function () {
  it('should equal', function () {
    var a = abi.rawDecode([ 'uint32' ], new Buffer('000000000000000000000000000000000000000000000000000000000000002a', 'hex'))
    var b = new BN(42)
    assert.equal(a.length, 1)
    assert.equal(a[0].toString(), b.toString())
  })
})


describe('decoding bytes', function () {
  it('should equal', function () {
    var a = abi.rawDecode([ 'bytes' ], new Buffer('0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000', 'hex'))
    var b = new Buffer('68656c6c6f20776f726c64', 'hex')

    assert.equal(a.length, 1)
    assert.equal(a[0].toString(), b.toString())
  })
})

describe('decoding string', function () {
  it('should equal', function () {
    var a = abi.rawDecode([ 'string' ], new Buffer('0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000', 'hex'))

	console.log(a);
    var b = 'hello world'
    assert.equal(a.length, 1)
    assert.equal(a[0], b)
  })
})

describe('decoding int32', function () {
  it('should equal', function () {
    var a = abi.rawDecode([ 'int32' ], new Buffer('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', 'hex'))
    var b = new BN(-2)
    assert.equal(a.length, 1)
    assert.equal(a[0].toString(), b.toString())

    a = abi.rawDecode([ 'int64' ], new Buffer('ffffffffffffffffffffffffffffffffffffffffffffffffffffb29c26f344fe', 'hex'))
    b = new BN(-85091238591234)
    assert.equal(a.length, 1)
    assert.equal(a[0].toString(), b.toString())
  })
  it('should fail', function () {
    assert.throws(function () {
      abi.rawDecode([ 'int32' ], new Buffer('ffffffffffffffffffffffffffffffffffffffffffffffffffffb29c26f344fe', 'hex'))
    }, Error)
  })
})

describe('decoding bool, uint32', function () {
  it('should equal', function () {
    var a = abi.rawDecode([ 'bool', 'uint32' ], new Buffer('0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002a', 'hex'))
    assert.equal(a.length, 2)
    assert.equal(a[0], true)
    assert.equal(a[1].toString(), new BN(42).toString())
  })
})
