/**
 * Created by darvin on 10/18/15.
 */
var chai = require('chai');
chai.should();
process.env.PDFDIFY_SECRET = "lskjldkhsdiofhfddfdfdwsdssdd";
var pdfdify = require('../lib');

describe('Encrypting/Decrypting', function(){

  it('should be sane', function() {
    var password = "somepassword";
    var encodedPassword = pdfdify.encrypt.encrypt(password);
    encodedPassword.should.be.ok;
    encodedPassword.should.not.be.equal(password);
    var decodedPassword = pdfdify.encrypt.decrypt(encodedPassword);
    decodedPassword.should.be.equal(password);

  })
});
