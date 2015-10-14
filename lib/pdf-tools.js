var path = require('path');
var fs = require('fs');
var request = require('request');
var sanitize = require("sanitize-filename");


module.exports.convertToPdf = function(opts, callback) {
  var Prince = require("prince");
  var outputBaseFileName = sanitize(opts.title)+".pdf";
  var outputFile = path.join(__dirname, '..', outputBaseFileName);
  Prince()
    .inputs(opts.url)
    .output(outputFile)
    .execute()
    .nodeify(function(err, result){
      callback(err, outputFile);
    });

};

module.exports.uploadFile = function(remoteUrl, username, password, remotePath, file, callback) {
  var options = {
    method: 'PUT',
    uri: remoteUrl+remotePath,
    auth: {
      user: username,
      password: password
    },

    form: {
      file: fs.createReadStream(file)
    },
  };
  console.log(options);

  request(options, function (err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    callback(err, body);
  });

};
