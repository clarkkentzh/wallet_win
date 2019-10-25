import wordList from './arrayWords'
import converters from './converters'
import {SHA256_init,SHA256_write,SHA256_finalize} from './sha256util'
import curve25519 from './curve25519'
import {BigInteger} from './jsbn'

export function getMenWords(){
    var crypto = window.crypto || window.msCrypto;
    let values = '';
    if (crypto) {
    
        let bits = 128;
    
        var random = new Uint32Array(bits / 32);
    
        crypto.getRandomValues(random);
    
        var i = 0,
            l = random.length,
            n = 1626,
            words = [],
            x, w1, w2, w3;
    
        for (; i < l; i++) {
            x = random[i];
            w1 = x % n;
            w2 = (((x / n) >> 0) + w1) % n;
            w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
    
            words.push(wordList[w1]);
            words.push(wordList[w2]);
            words.push(wordList[w3]);
        }
    
        values = words.join(" ");
    
        crypto.getRandomValues(random);
    
    }
    return values
}



export function getAccount(secretPhrase){
    if(secretPhrase){
        return getPublicKey(converters.stringToHexString(secretPhrase));
    }
}

export function getPrivateKey(secretPhrase) {
    var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);
    var digest = simpleHash(secretPhraseBytes);
    return converters.byteArrayToHexString(curve25519.keygen(digest).s);
    // SHA256_init();
    // SHA256_write(converters.stringToByteArray(secretPhrase));
    // return converters.shortArrayToHexString(curve25519_clamp(converters.byteArrayToShortArray(SHA256_finalize())));
};

export function getAccountId(secretPhrase) {
    return getAccountIdFromPublicKey(getPublicKey(converters.stringToHexString(secretPhrase)));
};

export function signBytes(message, secretPhrase) {
	var messageBytes = converters.hexStringToByteArray(message);
	var secretPhraseBytes = converters.hexStringToByteArray(converters.stringToHexString(secretPhrase));

	var digest = simpleHash(secretPhraseBytes);
	var s = curve25519.keygen(digest).s;
	var m = simpleHash(messageBytes);

	_hash.init();
	_hash.update(m);
	_hash.update(s);
	var x = _hash.getBytes();

	var y = curve25519.keygen(x).p;

	_hash.init();
	_hash.update(m);
	_hash.update(y);
	var h = _hash.getBytes();

	var v = curve25519.sign(h, x, s);

	return converters.byteArrayToHexString(v.concat(h));
};

export function verifyBytes(signature, message, publicKey) {
	var signatureBytes = converters.hexStringToByteArray(signature);
	var messageBytes = converters.hexStringToByteArray(message);
	var publicKeyBytes = converters.hexStringToByteArray(publicKey);
	var v = signatureBytes.slice(0, 32);
	var h = signatureBytes.slice(32);
	var y = curve25519.verify(v, h, publicKeyBytes);
	var m = simpleHash(messageBytes);

	_hash.init();
	_hash.update(m);
	_hash.update(y);
	var h2 = _hash.getBytes();

	return areByteArraysEqual(h, h2);
};

function areByteArraysEqual(bytes1, bytes2) {
    
	if (bytes1.length !== bytes2.length)
	    return false;

	for (var i = 0; i < bytes1.length; ++i) {
	    if (bytes1[i] !== bytes2[i])
		return false;
	}

	return true;
}

function getAccountIdFromPublicKey(publicKey) {
    var hex = converters.hexStringToByteArray(publicKey);

    _hash.init();
    _hash.update(hex);

    var account = _hash.getBytes();

    account = converters.byteArrayToHexString(account);

    var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

    var accountId = byteArrayToBigInteger(slice).toString();

    return accountId;
};

var _hash = {
    init: SHA256_init,
    update: SHA256_write,
    getBytes: SHA256_finalize
};

function byteArrayToBigInteger(byteArray, startIndex) {
    var value = new BigInteger("0", 10);
    var temp1, temp2;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        temp1 = value.multiply(new BigInteger("256", 10));
        temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
        value = temp2;
    }

    return value;
}

function simpleHash(message) {
    _hash.init();
    _hash.update(message);
    return _hash.getBytes();
}

function curve25519_clamp(curve) {
    curve[0] &= 0xFFF8;
    curve[15] &= 0x7FFF;
    curve[15] |= 0x4000;
    return curve;
}
    
function getPublicKey(secretPhrase) {
    let secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);
    let digest = simpleHash(secretPhraseBytes);
    return converters.byteArrayToHexString(curve25519.keygen(digest).p);
};