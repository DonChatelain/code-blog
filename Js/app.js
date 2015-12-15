//888888888888888888888888888
//  Code by Don Chatelain //
//          Blog Mockup  //
//             CF301    //
//888888888888888888888//

$(function() {


  webDB.init();
  blog.get_ajax();




  //run only if needs updating
  // webDB.setupTables();

//***ONCE UPDATED, SEND NEW ARRAY DATA TO DB********
//webDB.insertAllRecords(newArticleArray);


//***JUST LIKE GET_JSON FUNCTION*************
  // webDB.importArticlesFrom('blogArticles.JSON');




});

