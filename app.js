$(function() {

  function MakeAr(num) {
    this.num = num;
    this.title = blog.rawData[num].title;
    this.category = blog.rawData[num].category;
    this.author = blog.rawData[num].author;
    this.authorUrl = blog.rawData[num].authorUrl;
    this.publishedOn = blog.rawData[num].publishedOn;
    this.body = blog.rawData[num].body;
  };

  MakeAr.prototype.toHtml = function() {

    var $section = $('#articles');
    var timeStamp = parseInt((new Date() - new Date(this.publishedOn))/1000/60/60/24);
    var $newAr = $('article.arTemplate').clone().appendTo($section);
    $newAr.removeClass('arTemplate');
    $newAr.find('.arTitle').html(this.title);

    if (timeStamp === 1) {
      $newAr.find('.byLine').html('By ' + "<a href='" + this.authorUrl + "'>" + this.author + '</a>' + ' published ' + timeStamp + ' day ago');
    } else if (timeStamp === 0) {
      $newAr.find('.byLine').html('By ' + "<a href='" + this.authorUrl + "'>" + this.author + '</a>' + ' published today');
    } else {
      $newAr.find('.byLine').html('By ' + "<a href='" + this.authorUrl + "'>" + this.author + '</a>' + ' published ' + timeStamp + ' days ago');
    }
    $newAr.find('.arBody').html(this.body);
    $newAr.append('<br />' + '<hr>' + '<br />');
  };

  (function sortNewObj() {

    var articleArray = [];

    for (var i = 0; i < blog.rawData.length; i++) {
      articleArray[i] = new MakeAr(i);
    }
      articleArray.sort(function(a,b) {
        a = new Date(a.publishedOn);
        b = new Date(b.publishedOn);
        return b - a;
      });

    for (var i = 0; i < blog.rawData.length; i++) {
      articleArray[i].toHtml();
    }
  })();

});

