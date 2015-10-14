var express = require('express');
var handlebars = require("node-handlebars");
var path = require('path');
var fs = require('fs');
var url = require('url');
var bookmarkleter = require('bookmarkleter');
var browserify = require('browserify');
var concat = require('concat-stream')
var bodyParser = require('body-parser')

var DEBUG = true;
var bookmarklet = null;
var bookmarkletSource = null;
var concatStream = concat(function(res){
  bookmarkletSource = res.toString('utf8');
  bookmarklet = bookmarkleter(bookmarkletSource, {

  });
});
browserify(["./bookmarklet-source.js"])
  .bundle()
  .pipe(concatStream);



function createApp() {
  var templateDir = path.join(__dirname, "templates");
  var app = express();

  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  var hbs = handlebars.create({
    partialsDir :path.join(templateDir, "partials")
  });

  app.get('/convertPage', function (req, res) {
    console.log("POSTED PAGE! body: ", decodeURIComponent(req.query.url));
    res.jsonp({
      result:"ok"
    });

  });
	app.get('/', function (req, res) {
    //console.log(browserifiedBookmarkletSource);
    var absoluteURL = url.format({
      protocol:req.protocol,
      host:req.get('host'),
      pathname:req.originalUrl
    });

    var bookmarkletLocalize=function(src){
      var result = src;
      result = src.replace(new RegExp("XXX_absoluteURL_XXX", 'g'), absoluteURL);
      return result;
    }


    hbs.engine(path.join(templateDir, "index.html"), {
        bookmarklet:bookmarkletLocalize(bookmarklet),
        bookmarkletSource:bookmarkletLocalize(bookmarkletSource)
    },
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
