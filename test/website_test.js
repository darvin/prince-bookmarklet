var util = require('util');
var fs = require('fs');
var request = require('supertest');
var jsonp = require('superagent-jsonp');

var chai = require('chai');
chai.should();
var expect = chai.expect;

function expectMockPostRequest(callbackRequest, callbackCreated) {
  var express = require('express');
  var app = express();
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();

  var urlPath = "/webdav/";
  app.put(urlPath+":filePath", multipartMiddleware, function (req, res) {
    callbackRequest(null, req);
    res.send('ok');
    server.close(function () {

    });

  });

  var server = app.listen(3423, function () {
    var port = server.address().port;

    var fullUrl = util.format('http://localhost:%s%s', port, urlPath);
    callbackCreated(null, fullUrl);
  });

}

describe('Website', function(){
	var app = null;
	this.timeout(20000);

	before(function(done) {
		app = require('../server')();
		setTimeout(done, 1000);
	});

	it('should GET /', function(done) {
	  request(app)
		  .get('/')
		  .expect(200, /bookmarklet/, function(err, res){
		  	expect(err).to.not.be.ok;
		    done(err);
		  });
	});

  it('should GET /convertPage with readability and webdav', function(done) {
    var receivedRequest = null;
    expectMockPostRequest(function(err, req){
      receivedRequest = req
    }, function(err, mockUrl) {
      request(app)
        .get('/convertPage')
        .use(jsonp)
        .query({
          url:"https://en.wikipedia.org/wiki/Portable_Document_Format",
          title:"Portable Document Format <>WITH READABILITY<>!",
          readability:true,
          onFinish: {
            webdav: {
              username:"testuser",
              password:"testpassword",
              url:mockUrl
            }
          }
        })
        .expect(200, function(err, res){
          expect(err).to.not.be.ok;
          expect(receivedRequest).to.be.ok;
          expect(receivedRequest.files.file).to.be.ok;
          var file = receivedRequest.files.file;
          expect(file.size).to.be.greaterThan(46000);
          expect(file.name).to.equal("Portable Document Format.pdf");
          console.log(file.path);
          fs.unlinkSync(file.path);
          done(err);
        });
    });
  });

  it('should GET /convertPage without readability and with webdav', function(done) {
    var receivedRequest = null;
    expectMockPostRequest(function(err, req){
      receivedRequest = req
    }, function(err, mockUrl) {
      request(app)
        .get('/convertPage')
        .use(jsonp)
        .query({
          url:"https://en.wikipedia.org/wiki/Portable_Document_Format",
          title:"Portable Document Format WITHOUT READABILITY|||<<<!",
          readability:false,
          onFinish: {
            webdav: {
              username:"testuser",
              password:"testpassword",
              url:mockUrl
            }
          }
        })
        .expect(200, function(err, res){
          expect(err).to.not.be.ok;
          expect(receivedRequest).to.be.ok;
          expect(receivedRequest.files.file).to.be.ok;
          var file = receivedRequest.files.file;
          expect(file.size).to.be.greaterThan(38000);
          expect(file.name).to.equal("Portable Document Format WITHOUT READABILITY!.pdf");
          console.log(file.path);
          fs.unlinkSync(file.path);
          done(err);
        });
    });
  });

	
});
