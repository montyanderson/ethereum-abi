const BN = require("bn.js");
const keccak = require("keccak");

function isNumberType(type) {
	return type.startsWith("uint") || type.startsWith("int") || type === "bool";
}

function encodeNumber(number) {
	if(!BN.isBN(number)) {
		number = new BN(number);
	}

	return number.toTwos(256).toArrayLike(Buffer, "be", 32);
}

function decodeNumber(buf) {
	let number = new BN(buf.slice(0, 32).toString("hex"), 16);
	number = number.fromTwos(256);

	return [ 32, number ];
}

function isDynamicType(type) {
	return [ "string", "bytes" ].indexOf(type) !== -1;
}

function encodeDynamic(buf) {
	return Buffer.concat([
		encodeNumber(32),
		encodeNumber(buf.length),
		buf instanceof Buffer ? buf : Buffer.from(buf),
		Buffer.alloc(32 - (buf.length % 32), 0)
	]);
}

function decodeDynamic(buf) {
	let [, length ] = decodeNumber(buf.slice(32));
	length = +length;
	const data = buf.slice(64, 64 + length);
	return [ length + 64, data ];
}

const Abi = module.exports = {
	methodID(name, types) {
		types = types.map(type => {
			if(type === "uint") {
				return "uint256";
			}

			if(type === "int") {
				return "int256";
			}

			return type;
		});

		return keccak("keccak256")
		.update(`${name}(${types.join(",")})`)
		.digest()
		.slice(0, 4)
		.toString("hex");
	},

	rawEncode(types, args) {
		const encodedArgs = types.map((type, i) => {
			const arg = args[i];

			if(isNumberType(type) === true) {
				return encodeNumber(arg);
			}

			if(isDynamicType(type) === true) {
				return encodeDynamic(arg);
			}

			console.log(type, "what");
		});

		return Buffer.concat(encodedArgs);
	},

	rawDecode(types, buffer) {
		let offset = 0;

		return types.map((type, i) => {
			const buf = buffer.slice(offset);

			if(isNumberType(type)) {
				const [ length, data ] = decodeNumber(buf);
				offset += length;
				return data;
			}

			if(isDynamicType(type)) {
				const [ length, data ] = decodeDynamic(buf);
				offset += length;

				if(type === "string") {
					return data.toString();
				}

				return data;
			}
		});
	}
};
