

  var stat_mod = {};

  stat_mod.pulledArray = [];

  //=================================run only if eTags don't match!-----
  function localize_ajax_data() {
    $.getJSON('Data/blogArticles.json', function(data) {
      localStorage.setItem('rawBlogData', JSON.stringify(data));
    });
  }

  //=================================Main Data (LOCAL)
  function localBlogData() {
    stat_mod.pulledArray = [];
    html5sql.process(
      ['SELECT * FROM articles;'],
      function(transaction, results, rowsArray) {
        rowsArray.forEach(function(row) {
          stat_mod.pulledArray.push(row);
        });
        stat_mod.showAllAuthors();
        stat_mod.popStats();
      }
    );
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

  stat_mod.showAllAuthors = function() {
    var $list = $('#authorList');
    var blogData = stat_mod.pulledArray;
    var authorArray = get_unique_properties(blogData, 'author');
    var searchResult;
    var authorWords;
    authorArray.forEach(function(author) {
      searchResult = blogData.filter(searchFilter(author, 'author'));
      authorWords = avg_word_length(count_words(searchResult)).toFixed(2);
      $list.append('<li>' + author + ': ' + '<span>' + authorWords + '</span></li');
    });
  };

  stat_mod.popStats = function() {
    $('#totalPosts').text(count_articles(stat_mod.pulledArray));
    $('#totalAuthors').html(get_unique_properties(stat_mod.pulledArray, 'author').length);
    $('#totalWords').html(count_words(stat_mod.pulledArray).length);
    $('#avgWords').html(avg_word_length(count_words(stat_mod.pulledArray)).toFixed(2));
  };










