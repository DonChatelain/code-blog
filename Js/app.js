//888888888888888888888888888
//  Code by Don Chatelain //
//          Blog Mockup  //
//             CF301    //
//888888888888888888888//

$(function() {

  var newArticleArray = [];



  function setupTable() {

    webDB.init();
    webDB.execute(
      ['CREATE TABLE IF NOT EXISTS blog_table2 (id INT, title varchar(255), category varchar(255), author varchar(255));']
      ,
      //success callback
      function() {
        console.log('successfully called back baby');
      },
      //error callback
      function(error) {
        console.log('something went wrong I think');
      }
    );
  }

  function popTableTry() {
    webDB.execute(
      'INSERT INTO blog_table2 VALUES(1, "' + newArticleArray[0].title + '","' + newArticleArray[0].category + '","' + newArticleArray[0].author + '");'
      ,
      function() {
        console.log('successfully inserted row');
      },
      function() {
        console.log('you suck at life');
      }
    );
  }

  function popTable() {
    // console.log('newArticleArray populated: ' + newArticleArray[200].title);
    for (var i = 0; newArticleArray.length; i++) {
      webDB.execute(
        'INSERT INTO blog_table2 VALUES('+ i + ',"' + newArticleArray[i].title + '","' + newArticleArray[i].category + '","' + newArticleArray[i].author + '")
        ;'
        ,function() {
          // console.log('success in inserting: ' + newArticleArray[i].title);
        },
        function(error) {
          console.log('fail on inserting: '+ newArticleArray[i].title);
        }
      );
    }
  }

  setupTable();



  function get_ajax() {
    $.ajax({
      type: 'HEAD',
      url: ('blogArticles.JSON'),
      success: function(data, status, xhr) {
        console.log('blogArticles.json successfully retrieved');
        var eTag = xhr.getResponseHeader('eTag');
        console.log('got server etag: ' + eTag);
        var localEtag  = localStorage.getItem('localEtag');
        console.log('got local etag: ' + localEtag);
        if (localEtag) {
          console.log('theres a local etag');
          if (localEtag != eTag) {
            console.log('etags dont match');
            get_json(eTag);
            get_template();
          } else {
            console.log('etags match!');
            getLocal_Contruct();
            popTable();
            get_template();
          }
        } else {
          console.log('no local tag');
          get_json(eTag);
          get_template();
        }
      } //end success function
    }); //end ajax function
  }

  function getLocal_Contruct() {
    var rawblogData = localStorage.getItem('blogData');
    var blogData = JSON.parse(rawblogData);

    for (var i = 0; i < blogData.length; i++) {
      newArticleArray[i] = new MakeAr(blogData[i]);
    }
  }

  function get_json(placeHolderEtag) {
    console.log('get_json start');
    $.getJSON('blogArticles.JSON', function(data){
      console.log('success');
      localStorage.setItem('blogData', JSON.stringify(data));
      localStorage.setItem('localEtag', placeHolderEtag);
      console.log("sent etag to local: " + placeHolderEtag);
      var rawblogData = localStorage.getItem('blogData');
      var blogData = JSON.parse(rawblogData);
      console.log(blogData.length);
      for (var i = 0; i < blogData.length; i++) {
        newArticleArray[i] = new MakeAr(blogData[i]);
      }
      console.log('objects created', newArticleArray.length);

    });
  }

  function get_template() {

    popFilters();

    newArticleArray.sort(byDate);
    $.get('articleTemplate.handlebars', function(data) {
      for (var i = 0; i < newArticleArray.length; i++) {
        var compiled = Handlebars.compile(data);
        var html = compiled(newArticleArray[i]);
        $('#allArticles').append(html);
      }
      hideFullBody();
      $('.showMoreButton').on('click', function() {
        var $scrollHere = $(this).parent().position().top;
        if ($(this).text() === 'Read On') {
          $(this).prev().find('p:not(:first)').toggle();
          $(this).text('Show Less');
        } else {
          $(window).scrollTop($scrollHere);
          $(this).prev().find('p:not(:first)').toggle();
          $(this).text('Read On');
        }
      });
    });
  }

//Constructor to receive ext. data objects
  function MakeAr(obj) {
    this.title = obj.title;
    this.category = obj.category;
    this.author = obj.author;
    this.authorUrl = obj.authorUrl;
    this.publishedOn = obj.publishedOn;
    this.body = marked(obj.body);
    this.timeStamp = parseInt((new Date() - new Date(this.publishedOn))/1000/60/60/24);
    if (this.timeStamp === 1) {
      this.daysAgo = this.timeStamp + ' day ago';
    } else if (this.timeStamp === 0) {
      this.daysAgo = 'today';
    } else {
      this.daysAgo = this.timeStamp + ' days ago';
    }
  }

//--------Sorting Options------------------------

  function byDate(a,b) {
    a = new Date(a.publishedOn);
    b = new Date(b.publishedOn);
    return b - a;
  }
  function byAuthor(a,b) {
    if(a.author > b.author) {return 1;}
    if(b.author > a.author) {return -1;}
    else {
      return 0;
    }
  }
  function byCategory(a,b) {
    if(a.category > b.category) {return 1;}
    if(b.category > a.category) {return -1;}
    else {
      return 0;
    }
  }

  function hideFullBody() {
    $('.blogEntry').find('.entryBody p').hide();
    $('.blogEntry').find('.entryBody p:first-child').show();
  }

//populate both filter dropdown menus
  function popFilters() {

    var tempCatArray = [];
    var uniqueCatArray = [];
    var tempAuthArray = [];
    var uniqueAuthArray = [];

    newArticleArray.sort(byCategory);
    $('#catSelect').append('<option value="default">-Filter by Category-</option');
    $('#catSelect').append('<option value="all">All</option');
    for (var i = 0; i < newArticleArray.length; i++) {
      tempCatArray[i] = newArticleArray[i].category;
    }
    uniqueCatArray = jQuery.unique(tempCatArray);
    for (i = 0; i < uniqueCatArray.length; i++) {
      $('#catFilter').find('select').append('<option value="' + uniqueCatArray[i] + '">' + uniqueCatArray[i] + '</option>');
    }
    newArticleArray.sort(byAuthor);
    $('#authSelect').append('<option value="default">-Filter by Author-</option');
    $('#authSelect').append('<option value="all">All</option');
    for (var i = 0; i < newArticleArray.length; i++) {
      tempAuthArray[i] = newArticleArray[i].author;
    }
    uniqueAuthArray = jQuery.unique(tempAuthArray);
    for (i = 0; i < uniqueAuthArray.length; i++) {
      $('#authFilter').find('select').append('<option value="' + uniqueAuthArray[i] + '">' + uniqueAuthArray[i] + '</option>');
    }
  }

  //-----------Executives----------------

  get_ajax();


//-------------Event Handling--------------

//about me tab
  $('#aboutTab').on('click', function(e) {
    e.preventDefault();
    if ($('#aboutMe').is(':hidden')) {
      $('#aboutMe').slideDown('fast');
    }
    else {
      $('#aboutMe').slideUp('fast');
    }
  });
//category filter
  $('#catSelect').on('change', function(e) {
    // e.preventDefault();
    var sel = $(this).val();
    $('article').hide();
    $(".catLine:contains('" + sel + "')").parents('article').show();
    if (sel == 'all' || sel == 'default') {
      $('article').show();
    }
  });
//author filter
  $('#authSelect').on('change', function(e) {
    e.preventDefault();
    var sel = $(this).val();
    $('article').hide();
    $(".authLine:contains('" + sel + "')").parents('article').show();
    if (sel == 'all' || sel == 'default') {
      $('article').show();
    }
  });

//---END--------------------END------------------------END
});

