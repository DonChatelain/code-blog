var util = {};

util.byDate = function(a,b) {
  a = new Date(a.publishedOn);
  b = new Date(b.publishedOn);
  return b - a;
};

util.byAuthor = function(a,b) {
  if(a.author > b.author) {return 1;}
  if(b.author > a.author) {return -1;}
  else {
    return 0;
  }
};

util.byCategory = function(a,b) {
  if(a.category > b.category) {return 1;}
  if(b.category > a.category) {return -1;}
  else {
    return 0;
  }
};

