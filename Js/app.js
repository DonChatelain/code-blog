//888888888888888888888888888
//  Code by Don Chatelain //
//          Blog Mockup  //
//             CF301    //
//888888888888888888888//

page.base('/');

$(function() {

  page('/', router.init);
  page('stats', router.stats);
  page('newpost', router.newPost);
  page();

  $('.statsButton').on('click', function(e) {
    page('stats');
    e.preventDefault();
  });

  $('.newPostButton').on('click', function(e) {
    e.preventDefault();
    page('newpost');
  });

  $('.articlesButton').on('click', function(e) {
    e.preventDefault();
    page('/');
  });

});







