
var bookmarkleter = require('bookmarkleter');
var browserify = require('browserify');
var concat = require('concat-stream')
var path = require('path');

module.exports = function(callback) {
  var concatStream = concat(function(res){
    bookmarkletSource = res.toString('utf8');
    bookmarklet = bookmarkleter(bookmarkletSource, {

    });
    callback(null, bookmarklet, bookmarkletSource);

  });
  browserify([path.join(__dirname,"./bookmarklet-source.js")])
    .bundle()
    .pipe(concatStream);

};