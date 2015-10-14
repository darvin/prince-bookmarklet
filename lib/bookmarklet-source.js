var jQuery = require("jquery");
var noty = require("noty");
var notify = function(filename) {
  var n = noty({
    type: 'success',
    layout:'topRight',
    theme:'relax',
    timeout: 1300,
    text: "<b>Web page conventered to PDF</b><br>Output: <i>'"+filename+"'</i>"
  });
};



jQuery.ajax({
  url: "XXX_absoluteURL_XXXconvertPage",

  // The name of the callback parameter, as specified by the YQL service
  jsonp: "callback",

  // Tell jQuery we're expecting JSONP
  dataType: "jsonp",

  // Tell YQL what we want and that we want JSON
  data: {
    url:encodeURIComponent(window.location),
    title:document.title
  },

  // Work with the response
  success: function( response ) {
    notify(response.filename);
  }
});
