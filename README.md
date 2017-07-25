# ethereum-abi

Fully-tested, lightweight Ethereum ABI encoder/decoder ([ethereumjs-abi](https://github.com/ethereumjs/ethereumjs-abi/) comes to **500k+** in browserify)


Currently supports:

* all `uint`/`int` types
* `string`
* `bytes`
* `bool`

To do:

* Fixed-size arrays
* Dynamic arrays of all types

## Usage

``` javascript
const abi = require("ethereum-abi");
```

* Get a method signature

``` javascript
abi.methodID("test", [ "uint" ]);
```

* Encode arguments

``` javascript
abi.rawEncode([ "uint", "int32" ], [ 12, 300 ]);
```

* Decode arguments

``` javascript
abi.rawDecode([ "int64" ], Buffer.from("ffffffffffffffffffffffffffffffffffffffffffffffffffffb29c26f344fe", "hex"));
```
