var express = require('express');
var handlebars = require("node-handlebars");
var path = require('path');
var fs = require('fs');
var url = require('url');
var bookmarkletify = require('bookmarkletify');


function createApp() {
  var templateDir = path.join(__dirname, "templates");
  var app = express();
  var hbs = handlebars.create({
    partialsDir :path.join(templateDir, "partials")
  });


	app.get('/', function (req, res) {

    var absoluteURL = url.format({
      protocol:req.protocol,
      host:req.get('host'),
      pathname:req.originalUrl
    });

    hbs.engine(path.join(templateDir, "bookmarklet-source.js"), {absoluteURL:absoluteURL}, function(err, bookmarkletSource) {
      if (err)
        throw err;
      var bookmarkletCompiled = bookmarkletify(bookmarkletSource);

      hbs.engine(path.join(templateDir, "index.html"), {bookmarklet:bookmarkletCompiled},
        function(err, html) {
        if (err)
          throw err;
        res.send(html);
      });
    });
  });

  return app;
}


var server = createApp().listen(process.env.PORT||3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
