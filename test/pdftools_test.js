/**
 * Created by darvin on 10/18/15.
 */
var chai = require('chai');
chai.should();
var expect = chai.expect;

var pdfdify = require('../lib');

describe('PDFTools', function(){

  it('should choose proper readability engine', function() {
    expect(pdfdify.pdfTools.readabilityEngineForUrl('http://google.com')).to.be.equal('readability');
    expect(pdfdify.pdfTools.readabilityEngineForUrl('https://en.wiktionary.org/wiki/Wiktionary:Welcome,_newcomers')).to.be.equal('dummy');
    expect(pdfdify.pdfTools.readabilityEngineForUrl('https://en.wikipedia.org/wiki/Banksia_verticillata')).to.be.equal('dummy');

  });
});
