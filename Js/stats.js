$(function() {

  var blog_stat_module = {};

  //=================================run only if eTags don't match!-----
  function localize_ajax_data() {
    $.getJSON('blogArticles.JSON', function(data) {
      localStorage.setItem('rawBlogData', JSON.stringify(data));
      console.log('blogArticles.json retrieved and stored in local');
    });
  }

  //=================================Main Data (LOCAL)
  function localBlogData() {
    return JSON.parse(localStorage.getItem('rawBlogData'));
  }

  // ================================Counting and Sorting functions
  function count_articles(data) {
    return data.length;
  }
  function get_unique_properties(data, property) {
    var results = [];
    data.forEach(function(article) {
      results.push(article[property]);
    });
    results = $.unique(results);
    return results;
  }
  function count_words(data) {
    var words = [];
    data.forEach(function(article) {
      words = words.concat(article.body.split(/\s+/));
    });
    return words;
  }

  function avg_word_length(data) {
    var avgWordLength;
    var totalLetters = 0;
    var totalWords = data;
    totalWords.forEach(function(word) {
      totalLetters += word.length;
    });
    avgWordLength = totalLetters/totalWords.length;
    return avgWordLength;
  }

  function searchFilter(value, property) {
    var searchFor = value;
    return function(item) {
      return item[property] == value;
    };
  }

  blog_stat_module.showAllAuthors = function() {
    var $list = $('#authorList');
    var blogData = localBlogData();
    var authorArray = get_unique_properties(localBlogData(), 'author');
    var searchResult;
    var authorWords;
    authorArray.forEach(function(author) {
      searchResult = blogData.filter(searchFilter(author, 'author'));
      authorWords = avg_word_length(count_words(searchResult)).toFixed(2);
      $list.append('<li>' + author + ': ' + '<span>' + authorWords + '</span></li');
    });
  };

  blog_stat_module.popStats = function() {
    $('#totalPosts').text(count_articles(localBlogData()));
    $('#totalAuthors').html(get_unique_properties(localBlogData(), 'author').length);
    $('#totalWords').html(count_words(localBlogData()).length);
    $('#avgWords').html(avg_word_length(count_words(localBlogData())).toFixed(2));
  };

  blog_stat_module.showAllAuthors();
  blog_stat_module.popStats();

});






