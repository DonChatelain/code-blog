$(function() {

    var $pTitle = $('#titleInput');
    var $pAuthor = $('#authorInput');
    var $pCategory = $('#categoryInput');
    var $pBody = $('#postBody');

    function render() {
        var newPost = {};
        var markDownOutput = marked($pBody.val());
        var today = new Date();

        newPost.title = $pTitle.val();
        newPost.author = $pAuthor.val();
        newPost.category = $pCategory.val();
        newPost.body = markDownOutput;
        newPost.publishedOn = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        newPost.timeStamp = parseInt((new Date() - new Date(newPost.publishedOn))/1000/60/60/24);
        if (newPost.timeStamp === 1) {
          newPost.daysAgo = newPost.timeStamp + ' day ago';
        } else if (newPost.timeStamp === 0) {
          newPost.daysAgo = 'today';
        } else {
          newPost.daysAgo = newPost.timeStamp + ' days ago';
        }

        $.get('articleTemplate.handlebars', function(data) {
            var compiled = Handlebars.compile(data);
            var preview = compiled(newPost);
            $('#postOutput').html(preview);
        });

        $('#rawHTML').text(newPost.body);
        $('#jsonOutput').text(JSON.stringify(newPost));
    }

    $pTitle.on('input', render);
    $pAuthor.on('input', render);
    $pCategory.on('input', render);
    $pBody.on('input', render);

    render();

});
