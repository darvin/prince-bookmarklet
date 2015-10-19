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

  if (opts.readability) {
    module.exports.pdfTools.convertToReadable(opts.srcUrl, function(err, readableResult, cleanupFunc) {
      toPdf(readableResult.tempFile, readableResult.title, function(err, cleanupPdfFunc, pdfFile){
        cleanupFunc(function(){
            callback(err, cleanupPdfFunc, pdfFile);
        });
      });
    });
  } else {
    toPdf(opts.srcUrl, opts.title, callback);
  }

};