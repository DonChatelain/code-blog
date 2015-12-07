$(function() {



    var postNew = (function() {

        var my = {};

        var $postBodyAttribute = $('#postBodyAttribute');
        var $rawHTML = $('#rawHTML');
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
        	$rawHTML.text(my.markdown);
        	$output.html(my.markdown);
        	markdownObject.body = my.markdown;
            var jsonSaved = JSON.stringify(markdownObject);
        	$jsonOutput.text(jsonSaved);

            // localStorage.setItem('draftPost' , jsonSaved);

        };

        my.getInput = function() {
        	markdownObject.title = $('#titleInput').val();
        	markdownObject.author = $('#authorInput').val();
        	markdownObject.category = $('#categoryInput').val();
        	var date = new Date();
        	markdownObject.publishedOn = date.getFullYear() + "-" + my.pad( date.getMonth() + 1, 2 ) + "-" + my.pad(date.getDate(), 2);
        	my.render();
        };

        $postBodyAttribute.on('input', my.render);

        my.render();

        return my;
    })();

    $('#savePostAttributes').on('click', function() {
        postNew.getInput();
    });

    $('#submitNewPostButton').on('click', function() {
        localStorage.clear();
    });
});
