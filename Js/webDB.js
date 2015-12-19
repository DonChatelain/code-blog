var webDB = {};

//verbose?
webDB.verbose = function (verbose) {
  var msg;
  if (verbose) {
    html5sql.logInfo = true;
    html5sql.logErrors = true;
    html5sql.putSelectResultsInArray = true;
    msg = 'html5sql verbosity on';
  } else {
    html5sql.logInfo = false;
    html5sql.logErrors = false;
    html5sql.putSelectResultsInArray = false;
    msg = 'html5sql verbosity off';
  }
  console.log(msg);
};

//prepares 'BlogDB' in browser and handles errors
webDB.init = function() {
  // Open and init DB
  try {
    if (openDatabase) {
      webDB.verbose(true);
      webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
    } else {
      console.log('Web Databases not supported.');
    }
  } catch (e) {
    console.error('Error occured during DB init. Web Database may not be supported.');
  }
};

//connects to input database
webDB.connect = function (database, title, size) {
  html5sql.openDatabase(database, title, size);
};

// input path to json file and sends its data to database
webDB.importArticlesFrom = function (path) {
  // Import articles from JSON file
  $.getJSON(path, webDB.insertAllRecords);
  console.log('should be done importing about now');
};
webDB.insertAllRecords = function (articles) {
  articles.sort(util.byDate);
  articles.forEach(webDB.insertRecord);
};
webDB.insertRecord = function (a) {
  // insert article record into database
  html5sql.process(
    [
      {
        'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, body) VALUES (?, ?, ?, ?, ?, ?);',
        'data': [a.title, a.author, a.authorUrl, a.category, a.publishedOn, a.body],
      }
    ],
    function () {
      console.log('Success inserting record for ' + a.title);
    },
    function(error) {
      console.log('failed: ' + error.message);
    }
  );
};

//create table
webDB.setupTables = function () {
  html5sql.process(
    'CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY, title VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, authorUrl VARCHAR (255), category VARCHAR(20), publishedOn DATETIME, body BLOB NOT NULL);',
    function() {
      // on success
      console.log('Success setting up tables.');
    }
  );
};



webDB.execute = function (sql, callback) {
  callback = callback || function() {};
  html5sql.process(
    sql,
    function (tx, result, resultArray) {
      callback(resultArray);
    }
  );
};
