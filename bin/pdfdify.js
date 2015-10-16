#!/usr/bin/env node
var child_process = require('child_process');
var argv = require('yargs')
  .boolean(['readability', 'open'])
  .argv;
var pdfdify = require('../lib');
var srcUrl = argv._[0];
console.log("Convertering: '"+srcUrl+"'");

pdfdify.convert({
  title:argv.title|| srcUrl,
  readability:argv.readability,
  srcUrl:srcUrl
},function (err, pdfFile) {
  if (err) {
    throw err;
  }
  console.log("Created: '"+pdfFile+"'");
  if(argv.open) {
    child_process.exec('open "'+pdfFile+'"');
  }
});