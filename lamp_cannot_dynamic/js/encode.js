var key = CryptoJS.enc.Utf8.parse('9521314528002574');
var iv = CryptoJS.enc.Utf8.parse('4528453102574529');

function Encrypt(Str) {
	var encrypted = CryptoJS.AES.encrypt(Str, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7//.ZeroPadding
	});
	return encrypted;
}

function Decrypt(Str) {
	var decrypted = CryptoJS.AES.decrypt(Str, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}