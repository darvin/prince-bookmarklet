var path = require('path');
var fs = require('fs');
var request = require('request');
var sanitize = require("sanitize-filename");
var temp = require('temp').track();

var readability = require('readability-api');
readability.configure({
  parser_token: process.env.READABILITY_PARSER_API_KEY
});
var parser = new readability.parser();

module.exports.convertToPdf = function(opts, callback) {
  var Prince = require("prince");
  var outputBaseFileName = sanitize(opts.title)+".pdf";
  var outputFile = path.join(__dirname, '..', outputBaseFileName);
  Prince()
    .inputs(opts.input)
    .output(outputFile)
    .execute()
    .nodeify(function(err, result){
      callback(err, outputFile);
    });
};

var readabilityApi = function(url, callback) {
  parser.parse(url, function (err, parsed) {
    var fullContent = '<html><head><title>'+parsed.title+'</title></head><body>' +
        parsed.content + '</body></html>';
    temp.open({prefix: "readableTempFiles", suffix: ".html"}, function(err, info) {
      if (!err) {
        console.log("Readability temp file: "+ JSON.stringify(info));
        fs.writeFile(info.path, fullContent, 'utf8', function(err, res) {
          parsed.tempFile = info.path;
          callback(err, parsed, function(callback) {
            temp.cleanup(callback);
          });
        });

      }
    });

  });
};
var read = require('node-readability');

var nodeReadability = function(url, callback) {
  read(url, function (err, article, meta) {
    temp.open({prefix: "readableTempFiles", suffix: ".html"}, function(err, info) {
      if (!err) {
        console.log("Readability temp file: "+ JSON.stringify(info));
        fs.writeFile(info.path, article.html, 'utf8', function(err, res) {
          var title = article.title;
          article.close();

          callback(err, {
            title:title,
            tempFile:info.path
          }, function(callback) {
            temp.cleanup(callback);
          });
        });

      }
    });

  });
};


var dummy = function(url, callback) {
  callback(null, {url:url}, function(callback){ callback()});
};

var readabilityEngines = {
  "readability":readabilityApi,
  "node-readability":nodeReadability,
  "dummy":dummy
};

module.exports.readabilityEngines = readabilityEngines;
module.exports.readabilityEngineForUrl = function (url) {
  var ignore = [
    /wikipedia\./,
    /wiktionary\./
  ];

  for (var i=0; i<ignore.length; i++) {
    if (url.match(ignore[i])) {
      return 'dummy';
    }
  }
  if (process.env.READABILITY_PARSER_API_KEY)
    return "readability";
  else
    return "node-readability";
};

module.exports.uploadFile = function(remoteUrl, username, password, remotePath, file, callback) {

  var options = {
    method: 'PUT',
    uri: remoteUrl+remotePath,
    auth: {
      user: username,
      password: password
    },

  };
  console.log(options);

  var req = request(options, function (err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    callback(err, body);
  });
  var form = req.form();
  form.append('file', fs.createReadStream(file));

};
