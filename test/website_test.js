var request = require('supertest');
var chai = require('chai');
chai.should();
var expect = chai.expect;

describe('Website', function(){
	var app = null;
	this.timeout(4000);
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
	})

	
});
