jQuery = require("jquery");

alert( window.location + " /// bookmarklet host: XXX_absoluteURL_XXX");


jQuery.post("XXX_absoluteURL_XXX/convertPage", {url:window.location},  function( data ) {
  alert( "Post response: ", data);

});