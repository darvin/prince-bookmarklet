var password = process.env.PDFDIFY_SECRET;
var encryptor = require('simple-encryptor')(password);

module.exports.encrypt = function(text) {
  var result = encryptor.encrypt(text);
  return result;
};

module.exports.decrypt = function(encryptedText) {
  var result = encryptor.decrypt(encryptedText);
  return result;
};