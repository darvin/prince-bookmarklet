jQuery = require("jquery");
var notify = function(filename) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  var notification = new Notification('Web page conventered to PDF', {
    icon: 'https://cdn4.iconfinder.com/data/icons/CS5/512/ACP_PDF%202_file_document.png',
    body: "Result is in file: '"+filename+"'"
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
