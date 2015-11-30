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
  $section.append('<h2>' + this.title + '</h2>');
  $section.append('<h4>By ' + this.author + ' published ' + this.publishedOn + '</h4>');
  $section.append('<p>' + this.body + '</p>');

};

(function makeNewObjects() {
  var articles = [];
  for (var i = 0; i < blog.rawData.length; i++) {
    articles[i] = new MakeAr(i);
  }
  for(var x in articles) {
    articles[x].toHtml();
  }
}
)();
