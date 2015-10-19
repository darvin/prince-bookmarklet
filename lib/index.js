var fs = require('fs');

module.exports = {
  bookmarkletCompile: require('./bookmarklet-compile'),
  pdfTools: require('./pdf-tools'),
  encrypt: require('./encrypt')
};

module.exports.convert = function(opts, callback) {
  var toPdf = function (input, title, callback) {
    module.exports.pdfTools.convertToPdf({
      input:input,
      title:title
    }, function(err, pdfFilePath){
      var cleanupFunc = function(callback) {
        fs.unlink(pdfFilePath, callback);
      };
      callback(err, cleanupFunc, pdfFilePath);
    });
  };

  var readabilityEngine = module.exports.pdfTools.readabilityEngines["dummy"];
  if (opts.readability) {
    readabilityEngine = module.exports.pdfTools.readabilityEngines["readability"];
  }


  readabilityEngine(opts.srcUrl, function(err, readableResult, cleanupFunc) {
    toPdf(readableResult.tempFile||readableResult.url, readableResult.title||opts.title, function(err, cleanupPdfFunc, pdfFile){
      cleanupFunc(function(){
        callback(err, cleanupPdfFunc, pdfFile);
      });
    });
  });
};