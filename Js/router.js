var router = {};
var articlesPopulated = false;
var statsPopulated = false;

router.init = function() {
  $('#statsPage').hide();
  $('#newPostPage').hide();
  $('#indexPage').show();
  webDB.init();
  webDB.setupTables();
  if (articlesPopulated === false) {
    blog.get_ajax();
    articlesPopulated = true;
  }
};

router.stats = function() {
  if (statsPopulated === false) {
    localBlogData();
    statsPopulated = true;
  }
  $('#statsPage').show();
  $('#newPostPage').hide();
  $('#indexPage').hide();

};

router.newPost = function() {
  $('#statsPage').hide();
  $('#newPostPage').show();
  $('#indexPage').hide();
};
