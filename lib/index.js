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
    }, callback);
  };

  if (opts.readability) {
    module.exports.pdfTools.convertToReadable(opts.srcUrl, function(err, readableResult, cleanupFunc) {
      toPdf(readableResult.tempFile, readableResult.title, function(err, pdfFile){
        cleanupFunc(function(){
            callback(err, pdfFile);
        });
      });
    });
  } else {
    toPdf(opts.srcUrl, opts.title, function(err, pdfFile){
      callback(err, pdfFile);
    });
  }

};