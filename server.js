var express = require('express');
var handlebars = require("node-handlebars");
var path = require('path');
var fs = require('fs');
var url = require('url');
var bookmarkletCompile = require('./lib').bookmarkletCompile;
var pdfTools = require('./lib').pdfTools;

var DEBUG = true;



function createApp() {
  var templateDir = path.join(__dirname, "templates");
  var app = express();


  var hbs = handlebars.create({
    partialsDir :path.join(templateDir, "partials")
  });

  app.get('/convertPage', function (req, res) {
    var srcUrl = decodeURIComponent(req.query.url);
    console.log("POSTED PAGE! body: ", srcUrl);
    pdfTools.convertToPdf({
      url:srcUrl,
      title:req.query.title
    }, function(err, pdfFilePath) {
      pdfTools.uploadFile(process.env.WEBDAV_URL,
        process.env.WEBDAV_USERNAME, process.env.WEBDAV_PASSWORD,
        path.basename(pdfFilePath), pdfFilePath, function(err, result) {
          res.jsonp({
            filename:path.basename(pdfFilePath),
            result:"ok",
            err:err
          });
        });
    });


  });
  bookmarkletCompile(function(err, bookmarklet, bookmarkletSource) {
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
  });

  return app;
}


var server = createApp().listen(process.env.PORT||3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
