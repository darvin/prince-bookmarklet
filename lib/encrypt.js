var password = process.env.PDFDIFY_SECRET;
var assert = require('assert');
var crypto = require('crypto');

assert(password, "Set PDFDIFY_SECRET variable!");
var Cryp = require('cryp');

var encryptor = new Cryp([crypto.pbkdf2Sync(password, 'salt', 4096, 32)]);

module.exports.encrypt = function(text) {
  var result = encryptor.encrypt(text, 'base64');
  return result;
};

module.exports.decrypt = function(encryptedText) {
  console.log("decrypt ", encryptedText);
  var result = encryptor.decrypt(encryptedText, 'base64', 'utf8');
  console.log("decrypt> ", result);

  return result;
};