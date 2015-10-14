var express = require('express');
var handlebars = require("node-handlebars");
var path = require('path');
var fs = require('fs');
var url = require('url');
var bookmarkleter = require('bookmarkleter');
var browserify = require('browserify');
var concat = require('concat-stream')

var bookmarklet = null;

var concatStream = concat(function(res){
  bookmarklet = bookmarkleter(res.toString('utf8'));
});
browserify(["./bookmarklet-source.js"])
  .bundle()
  .pipe(concatStream);



function createApp() {
  var templateDir = path.join(__dirname, "templates");
  var app = express();
  var hbs = handlebars.create({
    partialsDir :path.join(templateDir, "partials")
  });


	app.get('/', function (req, res) {
    //console.log(browserifiedBookmarkletSource);
    var absoluteURL = url.format({
      protocol:req.protocol,
      host:req.get('host'),
      pathname:req.originalUrl
    });


    var bookmarkletLocal = bookmarklet;

    bookmarkletLocal = bookmarkletLocal.replace("XXX_absoluteURL_XXX", absoluteURL);

    hbs.engine(path.join(templateDir, "index.html"), {bookmarklet:bookmarkletLocal},
      function(err, html) {
      if (err)
        throw err;
      res.send(html);
    });
  });

  return app;
}


var server = createApp().listen(process.env.PORT||3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});