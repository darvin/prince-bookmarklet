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
    pdfTools.convertToReadable(srcUrl, function(err, readableResult, cleanupFunc) {
      pdfTools.convertToPdf({
        input:readableResult.tempFile,
        title:readableResult.title
      }, function(err, pdfFilePath) {
        if (req.query.onFinish.webdav)
          pdfTools.uploadFile(
            req.query.onFinish.webdav.url,
            req.query.onFinish.webdav.username,
            req.query.onFinish.webdav.password,
            path.basename(pdfFilePath), pdfFilePath, function(err, result) {
              res.jsonp({
                filename:path.basename(pdfFilePath),
                result:"ok",
                err:err
              });
            });
      });
    });



  });
  bookmarkletCompile(function(err, bookmarklet, bookmarkletSource) {
    app.get('/', function (req, res) {
      //console.log(browserifiedBookmarkletSource);
      var absoluteURL = "//"+req.get('host')+req.originalUrl;

      var bookmarkletLocalize=function(src){
        var result = src;
        result = src.replace(new RegExp("XXX_absoluteURL_XXX", 'g'), absoluteURL);
        return result;
      };


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



var main = function(){
  var port = process.env.PORT||3000;
  var server = createApp().listen(port, function () {
    console.log("Server is now listening on port " + server.address().port);
  })
}

if (require.main === module) {
  main();
}

module.exports = createApp;