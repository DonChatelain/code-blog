
var NEW_BLOG_POST_MODULE = (function() {
    var my = {};
    /* 
       var marked = require('marked');
    marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false,
	forceid: false
    });
    */
    
    var $postBodyAttribute = $('#postBodyAttribute');
    var $intermediateHTML = $('#intermediateHTML');
    var $output = $('#postOutput');
    var $jsonOutput = $('#jsonOutput');
    var markdownObject = {};

    my.pad = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
    }

    my.render = function() {
	console.log("Here I am");
	var postBodyAttribute = $postBodyAttribute.val();
	my.markdown = marked(postBodyAttribute);
	console.log(my.markdown);
	$intermediateHTML.text(my.markdown);
	$output.html(my.markdown);
	markdownObject.body = my.markdown;
	console.log(markdownObject);
	$jsonOutput.text(JSON.stringify(markdownObject));
	
    }
    
    my.getInput = function() {
	markdownObject.title = $('#titleInput').val();
	markdownObject.author = $('#authorInput').val();
	markdownObject.category = $('#categoryInput').val();
	var date = new Date();
	markdownObject.publishedOn = date.getFullYear() + "-"
	    + my.pad( date.getMonth() + 1, 2 ) + "-" + my.pad(date.getDate(), 2);
	console.log(markdownObject.publishedOn);
	my.render();
    }


	
    $postBodyAttribute.on( 'input', my.render );

    my.render();

    return my;
})();
