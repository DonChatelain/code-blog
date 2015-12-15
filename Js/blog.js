var blog = {};
var newArticleArray = [];

//fetches eTag from json file and acts depending on if it matches
blog.get_ajax = function() {
  $.ajax({
    type: 'HEAD',
    url: ('blogArticles.JSON'),
    success: function(data, status, xhr) {
      var eTag = xhr.getResponseHeader('eTag');
      var localEtag  = localStorage.getItem('localEtag');
      if (localEtag) {
        if (localEtag != eTag) {
          blog.get_json(eTag);
          blog.main();
        } else {
          blog.main();
          blog.filter();
        }
      } else {
        blog.get_json(eTag);
        blog.main();
      }
    }
  });
};

//manually fetches data from json file--- used when etags dont match
//also updates local storage etag
blog.get_json = function(placeHolderEtag) {
  $.getJSON('blogArticles.JSON', function(data) {
    localStorage.setItem('blogData', JSON.stringify(data));
    localStorage.setItem('localEtag', placeHolderEtag);
  });
};

//Constructor to receive ext. data objects
blog.BlogArticle = function(obj) {
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
};

//fetches local storage data and pushes to newArticleArray[]
blog.getLocal_Contruct = function() {
  var rawblogData = localStorage.getItem('blogData');
  var blogData = JSON.parse(rawblogData);
  blogData.forEach(function(article) {
    newArticleArray.push(new blog.BlogArticle(article));
  });
};

blog.getDB_contruct = function() {
  html5sql.process(
    ['SELECT * FROM articles LIMIT 10;'],
    function(transaction, results, rowsArray) {
      rowsArray.forEach(function(row) {
        newArticleArray.push(new blog.BlogArticle(row));
      });
      blog.popSelectFilter();
      blog.useTemplate(newArticleArray);
    }
  );
};





//apply items in input array to handlebars templater
//also contains hide full body function
blog.useTemplate = function(array) {
  array.sort(util.byDate);
  $.get('articleTemplate.handlebars', function(data) {
    array.forEach(function(article) {
      var templater = Handlebars.compile(data);
      var newHtml = templater(article);
      $('#allArticles').append(newHtml);
    });
    blog.hideFullBody();
  });
};

//hides full body and only shows first paragraph   !!!!!MODIFY!!!!
blog.hideFullBody = function() {
  $('.blogEntry').find('.entryBody p').hide();
  $('.blogEntry').find('.entryBody p:first-child').show();
};

//populate both filter dropdown menus
blog.popSelectFilter = function() {
  var authorArray = [];
  var catArray = [];
  html5sql.process(
    ['SELECT DISTINCT author FROM articles ORDER BY author ASC;'],
    function(transaction, results, rowsArray) {
      rowsArray.forEach(function(row) {
        authorArray.push(row.author);
      });
      authorArray.forEach(function(author) {
        $('#authSelect').append('<option value="' + author + '">' + author + '</option>');
      });
    }
  );
  html5sql.process(
    ['SELECT DISTINCT category FROM articles ORDER BY category ASC;'],
    function(transaction, results, rowsArray) {
      rowsArray.forEach(function(row) {
        catArray.push(row.category);
      });
      catArray.forEach(function(category) {
        $('#catSelect').append('<option value="' + category + '">' + category + '</option>');
      });
    }
  );

};

//buttons, etc
blog.setEventListeners = function() {
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
  //Show more buttons-----Listening to parent and waiting for classes to be created---
  $('#allArticles').on('click', '.showMoreButton', function() {
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
};

//contructing and populating functions wrapped up into one!
blog.main = function() {
  blog.setEventListeners();
  blog.getDB_contruct();

};
