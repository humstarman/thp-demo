(function(){
	var jsFiles = [
		       "option.js",
		       "cache.js",
		       "script.js",
               "util.js",
               //"graphic.js",
               //"graphicManager.js",
               //"graphicFactory.js",
               //"map.js",
               "task.js",
           ]; // etc.
	
	var scriptTags = new Array(jsFiles.length);
	var host ="static/app/";
	for (var i=0, len=jsFiles.length; i<len; i++) {
	    scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>"; 
	}
	if (scriptTags.length > 0) {
	    document.write(scriptTags.join(""));
	}
})(); 
