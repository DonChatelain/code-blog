//888888888888888888888888888
//  Code by Don Chatelain //
//          Blog Mockup  //
//             CF301    //
//888888888888888888888//

$(function() {

  var tempArticleArray = [];
  var newArticleArray = [];

  function ajaxify() {
    $.ajax({
      type: 'HEAD',
      url: ('blogArticles.JSON'),
      success: function(data, status, jqHXR) {
        var eTag = jqHXR.getResponseHeader('eTag');
        console.log(eTag);
        localStorage.setItem('ergodicEtag', eTag);
      }
    });
    $.getJSON('blogArticles.JSON', function(data){
      localStorage.setItem('blogData', JSON.stringify(data));
      var rawblogData = localStorage.getItem('blogData');
      var blogData = JSON.parse(rawblogData);
      for (var i = 0; i < blogData.length; i++) {
        newArticleArray[i] = new MakeAr(blogData[i]);
      }
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
    });
  }


  var articleArray = [];

//Constructor to receive ext. data objects
  function MakeAr(obj) {
    this.title = obj.title;
    this.category = obj.category;
    this.author = obj.author;
    this.authorUrl = obj.authorUrl;
    this.publishedOn = obj.publishedOn;
    this.body = obj.body;
    this.timeStamp = parseInt((new Date() - new Date(this.publishedOn))/1000/60/60/24);
    if (this.timeStamp === 1) {
      this.daysAgo = this.timeStamp + ' day ago';
    } else if (this.timeStamp === 0) {
      this.daysAgo = 'today';
    } else {
      this.daysAgo = this.timeStamp + ' days ago';
    }
  }
//DOM cloning + populating
  function sendAllToDom() {

    articleArray.sort(byDate);

    $.get('articleTemplate.handlebars', function(data) {
      for (var i = 0; i < articleArray.length; i++) {
        var compiled = Handlebars.compile(data);
        var html = compiled(articleArray[i]);
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

  function hideFullBody() {
    $('.blogEntry').find('.entryBody p').hide();
    $('.blogEntry').find('.entryBody p:first-child').show();
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

  //-------------Populating functions-----------

  function constructObjs() {
    for (var i = 0; i < blogData.length; i++) {
      newArticleArray[i] = new MakeAr(blogData[i]);
    }
    // var articlesToStorage = JSON.stringify(articleArray);
    // localStorage.setItem('articles', articlesToStorage);
  }

//populate both filter dropdown menus
  function popFilters() {
    var tempCatArray = [];
    var uniqueCatArray = [];

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
    articleArray.sort(byAuthor);
    $('#authSelect').append('<option value="default">-Filter by Author-</option');
    $('#authSelect').append('<option value="all">All</option');
    for (i = 0; i < newArticleArray.length; i++) {
      $('#authFilter').find('select').append('<option value="' + newArticleArray[i].author + '">' + newArticleArray[i].author + '</option>');
    }
  }

  //-----------Executives----------------
  ajaxify();
  // constructObjs();
  // popFilters();

  // sendAllToDom();



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

