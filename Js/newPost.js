
var NEW_BLOG_POST_MODULE = (function() {

    var my = {};

    var $postBodyAttribute = $('#postBodyAttribute');
    var $intermediateHTML = $('#intermediateHTML');
    var $output = $('#postOutput');
    var $jsonOutput = $('#jsonOutput');
    var markdownObject = {};

//converts date string format to conform to existing blog.rawData
    my.pad = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
    };

    my.render = function() {

    	var postBodyAttribute = $postBodyAttribute.val();
    	my.markdown = marked(postBodyAttribute);
    	$intermediateHTML.text(my.markdown);
    	$output.html(my.markdown);
    	markdownObject.body = my.markdown;
    	$jsonOutput.text(JSON.stringify(markdownObject));
    };

    my.getInput = function() {
    	markdownObject.title = $('#titleInput').val();
    	markdownObject.author = $('#authorInput').val();
    	markdownObject.category = $('#categoryInput').val();
    	var date = new Date();
    	markdownObject.publishedOn = date.getFullYear() + "-" + my.pad( date.getMonth() + 1, 2 ) + "-" + my.pad(date.getDate(), 2);
    	my.render();
    };

    $postBodyAttribute.on( 'input', my.render );

    my.render();

    return my;
})();
