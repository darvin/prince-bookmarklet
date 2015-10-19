var password = process.env.PDFDIFY_SECRET;
var assert = require('assert');

assert(password, "Set PDFDIFY_SECRET variable!");
assert(password.length>16, "PDFDIFY_SECRET length should be more than 16 chars!");
var encryptor = require('simple-encryptor')(password);

module.exports.encrypt = function(text) {
  var result = encryptor.encrypt(text);
  return result;
};

module.exports.decrypt = function(encryptedText) {
  var result = encryptor.decrypt(encryptedText);
  return result;
};