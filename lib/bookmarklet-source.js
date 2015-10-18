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


var bookmarkletOpts = XXX_opts_XXX;

jQuery.download = function(url, data, method) {
  //url and data options required
  if (url && data) {
    //data can be string of parameters or array/object
    data = typeof data == 'string' ? data : jQuery.param(data);
    //split params into form inputs
    var inputs = '';
    jQuery.each(data.split('&'), function() {
      var pair = this.split('=');
      inputs += '<input type="hidden" name="' + pair[0] +
        '" value="' + pair[1] + '" />';
    });
    //send request
    jQuery('<form action="' + url +
      '" method="' + (method || 'post') + '">' + inputs + '</form>')
      .appendTo('body').submit().remove();
  };
};

var requestParams = {
  url:encodeURIComponent(window.location),
  title:document.title,
  opts: bookmarkletOpts
};

if (!bookmarkletOpts.onFinish.open) {
  jQuery.ajax({
    url: "XXX_absoluteURL_XXXconvertPage",

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell YQL what we want and that we want JSON
    data: requestParams,

    // Work with the response
    success: function( response ) {
      notify(response.filename);
    }
  });
} else {
  jQuery.download(
    "XXX_absoluteURL_XXXconvertPage",
    requestParams, "GET"
  );

}