jQuery = require("jquery");

alert( window.location + " /// bookmarklet host: XXX_absoluteURL_XXX");


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
    alert( response ); // server response
  }
});
