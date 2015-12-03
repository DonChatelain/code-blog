//888888888888888888888888888
//  Code by Don Chatelain //
//          Blog Mockup  //
//             CF301    //
//888888888888888888888//

$(function() {

  var articleArray = [];


//Constructor to receive ext. data objects
  function MakeAr(num) {
    this.num = num;
    this.title = blog.rawData[num].title;
    this.category = blog.rawData[num].category;
    this.author = blog.rawData[num].author;
    this.authorUrl = blog.rawData[num].authorUrl;
    this.publishedOn = blog.rawData[num].publishedOn;
    this.body = blog.rawData[num].body;
  }
//DOM cloning + populating
  MakeAr.prototype.toHtml = function() {

    var $section = $('#articles');
    var timeStamp = parseInt((new Date() - new Date(this.publishedOn))/1000/60/60/24);
    var $newAr = $('article.arTemplate').clone();
    $newAr.removeClass('arTemplate');
    $newAr.find('.arTitle').html(this.title);

    if (timeStamp === 1) {
      $newAr.find('.byLine').html('By ' + "<a class='authLine' href='" + this.authorUrl + "'>" + this.author + '</a>' + ' published ' + timeStamp + ' day ago');
    } else if (timeStamp === 0) {
      $newAr.find('.byLine').html('By ' + "<a class='authLine' href='" + this.authorUrl + "'>" + this.author + '</a>' + ' published today');
    } else {
      $newAr.find('.byLine').html('By ' + "<a class='authLine' href='" + this.authorUrl + "'>" + this.author + '</a>' + ' published ' + timeStamp + ' days ago');
    }
    $newAr.find('.catLine').html('Category: ' + this.category);
    $newAr.find('.arBody').html(this.body);
    $newAr.find('.arBody p').hide();
    $newAr.find('.arBody p:first-child').show();

    $newAr.append('<br />' + '<br />' + '<br />' + '<br />' + '<hr>' + '<br />');

    $newAr.appendTo($section);
  };

//--------Sorting Options------------------------

  function byDate(a,b) {
    a = new Date(a.publishedOn);
    b = new Date(b.publishedOn);
    return b - a;
  }
  function byAuthor(a,b) {
    if(a.author > b.author) {return 1;}
    if(b.author > a.author) {return -1;}
    else {return 0;}
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
    for (var i = 0; i < blog.rawData.length; i++) {
      articleArray[i] = new MakeAr(i);
    }
  }
  function sortObjs() {
    constructObjs();
    articleArray.sort(byDate);
  }
  function popAllArticles() {
    sortObjs();
    for (var i = 0; i < blog.rawData.length; i++) {
      articleArray[i].toHtml();
    }
  }
//populate both filter dropdown menus
  function popFilters() {
    var tempCatArray = [];
    var uniqueCatArray = [];

    articleArray.sort(byCategory);
    $('#catSelect').append('<option value="All">-Filter by Category-</option');
    for (var i = 0; i < articleArray.length; i++) {
      tempCatArray[i] = articleArray[i].category;
    }
    uniqueCatArray = jQuery.unique(tempCatArray);

    for (i = 0; i < uniqueCatArray.length; i++) {
      $('#catFilter').find('select').append('<option value="' + uniqueCatArray[i] + '">' + uniqueCatArray[i] + '</option>');
    }
    articleArray.sort(byAuthor);
    $('#authSelect').append('<option value="All">-Filter by Author-</option');
    for (i = 0; i < articleArray.length; i++) {
      $('#authFilter').find('select').append('<option value="' + articleArray[i].author + '">' + articleArray[i].author + '</option>');
    }
  }

  //-----------Executives----------------

  popAllArticles();
  popFilters();

//-------------Event Handling--------------
//readon button
  $('.showMore').on('click', function() {
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
    console.log(sel);
    $('article:not(:first)').hide();
    $(".catLine:contains('" + sel + "')").parents('article').show();
    if (sel == 'All') {
      $('article:not(:first)').show();
    }
    // sel = 'All';
  });
//author filter
  $('#authSelect').on('change', function(e) {
    e.preventDefault();
    var sel = $('#authFilter :selected').val();
    console.log(sel);
    $('article:not(:first)').hide();
    $(".authLine:contains('" + sel + "')").parents('article').show();
    if (sel == 'All') {
      $('article:not(:first)').show();
    }
    // $('#authFilter : selected').val() = 'All';
  });


});

