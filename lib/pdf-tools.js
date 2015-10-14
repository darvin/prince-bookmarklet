module.exports.convertToPdf = function(opts, callback) {
  var Prince = require("prince");

  Prince()
    .inputs(opts.url)
    .output("test.pdf")
    .execute()
    .nodeify(callback);

};