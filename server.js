var express = require('express');
var handlebars = require("node-handlebars");
var path = require('path');
var fs = require('fs');
var url = require('url');
var bookmarkletCompile = require('./lib').bookmarkletCompile;
var pdfTools = require('./lib').pdfTools;
var pdfdify = require('./lib');
var DEBUG = true;



function createApp() {
  var templateDir = path.join(__dirname, "templates");
  var app = express();


  var hbs = handlebars.create({
    partialsDir :path.join(templateDir, "partials")
  });

  app.get('/convertPage', function (req, res) {
    var opts = req.query.opts;
    var srcUrl = decodeURIComponent(req.query.url);
    pdfdify.convert({
      srcUrl:srcUrl,
      readability:opts.readability=="true",
      title:req.query.title
    }, function(err, pdfFilePath) {
      if (opts.onFinish.webdav)
        pdfTools.uploadFile(
          opts.onFinish.webdav.url,
          opts.onFinish.webdav.username,
          pdfdify.encrypt.decrypt(opts.onFinish.webdav.password),
          path.basename(pdfFilePath), pdfFilePath, function(err, result) {
            res.jsonp({
              filename:path.basename(pdfFilePath),
              result:"ok",
              err:err
            });
            fs.unlink(pdfFilePath, function(err){
              callback(err);
            });
          });
    });




  });
  bookmarkletCompile(function(err, bookmarklet, bookmarkletSource) {

    var getBookmarkletForReq = function(src, req) {
      var absoluteURL = "//"+req.get('host')+'/';

      var result = src
        .replace(new RegExp("XXX_absoluteURL_XXX", 'g'), absoluteURL)
        .replace(new RegExp("XXX_opts_XXX", 'g'), JSON.stringify(req.query.opts));
      return result;
    };

    app.get('/bookmarkletLink.txt', function(req,res) {
      res.send(getBookmarkletForReq(bookmarklet, req));
    });

    app.get('/', function (req, res) {
      //console.log(browserifiedBookmarkletSource);


      hbs.engine(path.join(templateDir, "index.html"), {
          bookmarklet:getBookmarkletForReq(bookmarklet, req),
          bookmarkletSource:getBookmarkletForReq(bookmarkletSource,req)
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