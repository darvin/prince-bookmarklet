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


var opts = XXX_opts_XXX;

jQuery.download = function(url, data, method) {
  //url and data options required
  if (url && data) {
    //data can be string of parameters or array/object
    data = typeof data == 'string' ? data : decodeURIComponent(jQuery.param(data));
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
  opts:opts
};

console.log("opts", opts);

if (!opts.onFinish.open || !Boolean(opts.onFinish.open)) {
  console.log("opts.onFinish.open is not set, performing convertation in background...");
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
  console.log("opts.onFinish.open is set, open pdf!");

  jQuery.download(
    "XXX_absoluteURL_XXXconvertPage",
    requestParams, "GET"
  );

}