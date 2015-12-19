var blog = {};
var newArticleArray = [];
var currentPage = 25;

//fetches eTag from json file and acts depending on if it matches
blog.get_ajax = function() {
  $.ajax({
    type: 'HEAD',
    url: ('Data/blogArticles.json'),
    success: function(data, status, xhr) {
      var eTag = xhr.getResponseHeader('eTag');
      var localEtag  = localStorage.getItem('localEtag');
      if (localEtag) {
        if (localEtag != eTag) {
          console.log('etags dont match');
          blog.get_json(eTag);
          blog.main();
        } else {
          console.log('etags match baby!');
          blog.main();
        }
      } else {
        console.log('no local etag');
        blog.get_json(eTag);
        blog.main();
      }
    }
  });
};

//manually fetches data from json file--- used when etags dont match
//also updates local storage etag
blog.get_json = function(fakeEtag) {
  html5sql.process(
    ['DELETE FROM articles;'],
    function() {
      console.log('success in deleting table data');
    }
  );
  webDB.importArticlesFrom('Data/blogArticles.json');
  localStorage.setItem('localEtag', fakeEtag);
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

//populates main section with first 20 articles from DB by most recent
blog.getDB_contruct = function() {
  html5sql.process(
    ['SELECT * FROM articles ORDER BY publishedOn DESC LIMIT 25;'],
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
  $.get('articleTemplate.html', function(data) {
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

blog.anyFilter = function(selection, type) {
  newArticleArray = [];
  html5sql.process(
    ["SELECT * FROM articles WHERE " + type + "='" + selection + "';"],
    function(transaction, results, rowsArray) {
      rowsArray.forEach(function(row) {
        newArticleArray.push(new blog.BlogArticle(row));
      });
      blog.useTemplate(newArticleArray);
  });
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
    $('article').remove();
    blog.anyFilter(sel, 'category');
    if (sel == 'all' || sel == 'default') {
      newArticleArray = [];
      blog.getDB_contruct();
    }
  });
  //author filter
  $('#authSelect').on('change', function(e) {
    e.preventDefault();
    var sel = $(this).val();
    $('article').remove();
    blog.anyFilter(sel, 'author');
    if (sel == 'all' || sel == 'default') {
      newArticleArray = [];
      blog.getDB_contruct();
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

  $('.nextArticles').on('click', function() {
    blog.showNext(currentPage);
    currentPage += 25;
  });

};

//contructing and populating functions wrapped up into one!
blog.main = function() {
  blog.setEventListeners();
  blog.getDB_contruct();

};

//--------------------END-----------------------END-----------------------------END



//==BROKEN SORRY ****
blog.showNext = function(num) {
  newArticleArray = [];
  html5sql.process(
    ['SELECT * FROM articles ORDER BY publishedOn DESC LIMIT ' + num + ',25;'],
    // ['SELECT * FROM articles ORDER BY publishedOn DESC LIMIT 20,10;'],
    function(transaction, results, rowsArray) {
      rowsArray.forEach(function(row) {
        newArticleArray.push(new blog.BlogArticle(row));
      });
      blog.useTemplate(newArticleArray);
    }
  );
};
