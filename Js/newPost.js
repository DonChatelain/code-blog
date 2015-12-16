
var $pTitle = $('#titleInput');
var $pAuthor = $('#authorInput');
var $pCategory = $('#categoryInput');
var $pBody = $('#postBody');

var newPost;

function receiveDraft() {
    var fromLocal = localStorage.getItem('newPost');
    var draftPost = JSON.parse(fromLocal);
    if (localStorage.getItem('newPost') !== null) {
        $pTitle.val(draftPost.title);
        $pAuthor.val(draftPost.author);
        $pCategory.val(draftPost.category);
        $pBody.val(draftPost.preBody);
    }
}

function render() {
    newPost = {};
    var markDownOutput = marked($pBody.val());
    var today = new Date();

    newPost.title = $pTitle.val();
    newPost.author = $pAuthor.val();
    newPost.category = $pCategory.val();
    newPost.preBody = $pBody.val();
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

    $.get('articleTemplate.html', function(data) {
        var compiled = Handlebars.compile(data);
        var preview = compiled(newPost);
        $('#postOutput').html(preview);
    });

    $('#rawHTML').text(newPost.body);

    var toStorage = JSON.stringify(newPost);
    $('#jsonOutput').text(toStorage);
    localStorage.setItem('newPost', toStorage);

}

$pTitle.on('input', render);
$pAuthor.on('input', render);
$pCategory.on('input', render);
$pBody.on('input', render);

receiveDraft();
render();

$('#submitNewPostButton').on('click', function() {
    webDB.insertRecord(newPost);
    articlesPopulated = false;
    // localStorage.removeItem('newPost');
});


