var util = require('util');
var fs = require('fs');
var request = require('supertest');
var jsonp = require('superagent-jsonp');

var chai = require('chai');
chai.should();
var expect = chai.expect;
var basicAuth = require('basic-auth');

process.env.PDFDIFY_SECRET = "fasldfkasjdfkw23123dasd";

var pdfdify = require('../lib');


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
		setTimeout(done, 3000);
	});

	it('should GET /', function(done) {
	  request(app)
		  .get('/')
		  .expect(200, /bookmarklet/, function(err, res){
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
          url:"http://howtonode.org/coding-challenges-with-streams",
          title:"Bad Title <>WITH READABILITY<>!",
          opts: {
            readability: true,
            onFinish: {
              webdav: {
                username: "testuser",
                password: pdfdify.encrypt.encrypt("testpassword"),
                url: mockUrl
              }
            }
          }
        })
        .expect(200, function(err, res){
          expect(err).to.not.be.ok;
          expect(receivedRequest).to.be.ok;
          expect(receivedRequest.files.file).to.be.ok;
          var file = receivedRequest.files.file;
          expect(file.size).to.be.greaterThan(46000);
          expect(file.name).to.equal("Solving Coding Challenges with Streams.pdf");
          console.log(file.path);
          var auth = basicAuth(receivedRequest);
          console.log(auth);
          expect(auth.name).to.equal('testuser');
          expect(auth.pass).to.equal('testpassword');

          fs.unlinkSync(file.path);
          done(err);
        });
    });
  });


  it('should GET /convertPage on wikipedia with dummy readability and webdav', function(done) {
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
          opts: {
            readability: true,
            onFinish: {
              webdav: {
                username: "testuser",
                password: pdfdify.encrypt.encrypt("testpassword"),
                url: mockUrl
              }
            }
          }
        })
        .expect(200, function(err, res){
          expect(err).to.not.be.ok;
          expect(receivedRequest).to.be.ok;
          expect(receivedRequest.files.file).to.be.ok;
          var file = receivedRequest.files.file;
          expect(file.size).to.be.greaterThan(46000);
          expect(file.name).to.equal("Portable Document Format WITH READABILITY!.pdf");
          console.log(file.path);
          var auth = basicAuth(receivedRequest);
          console.log(auth);
          expect(auth.name).to.equal('testuser');
          expect(auth.pass).to.equal('testpassword');

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
          opts: {

            readability: false,
            onFinish: {
              webdav: {
                username: "testuser",
                password: pdfdify.encrypt.encrypt("testpassword"),
                url: mockUrl
              }
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

  it('should GET /convertPage with "open"', function(done) {
    request(app)
      .get('/convertPage')
      .use(jsonp)
      .query({
        url:"https://en.wikipedia.org/wiki/Portable_Document_Format",
        title:"Portable Document Format Redirect",
        opts: {
          onFinish: {
            open: true
          }
        }
      })
      .expect(200, function(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.be.ok;
        expect(res.headers['content-type']).to.equal('application/pdf');
        expect(res.headers['content-length']).to.be.greaterThan(1000);
        done(err);
      });
  });


  it('should POST /convertPage with "open"', function(done) {
    request(app)
      .post('/convertPage')
      .send({
        url:"https://en.wikipedia.org/wiki/Portable_Document_Format",
        title:"Portable Document Format Redirect",
        opts: {
          onFinish: {
            open: true
          }
        }
      })
      .expect(200, function(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.be.ok;
        expect(res.headers['content-type']).to.equal('application/pdf');
        expect(res.headers['content-length']).to.be.greaterThan(1000);
        done(err);
      });
  });

  it('should POST /encrypt', function(done) {
    request(app)
      .post('/encrypt')
      .send({
        string:"mypassword"
      })
      .expect(200, function(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.be.ok;
        expect(res.body.encrypted).to.be.ok;
        done(err);
      });
  });

  it('should GET /bookmarkletLink.txt without readability and with webdav', function(done) {
    request(app)
      .get('/bookmarkletLink.txt')
      .query()
      .use(jsonp)
      .query({
        opts:{
          readability:true,
          onFinish: {
            webdav: {
              username:"testuser",
              password:"testpassword"
            }
          }
        }
      })
      .expect(200, function(err, res){
        expect(err).to.not.be.ok;
        expect(res.text).to.match(/^javascript\:\(function/);
        expect(res.text).to.not.match(/bookmarkletLink/);
        expect(res.text).to.match(/testuser/);
        //expect(res.text).to.match(new RegExp(pdfdify.encrypt.encrypt("testpassword")));
        done(err);
      });
  });
});
