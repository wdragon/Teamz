module.exports = TeamzUtils;

var urllite = require('urllite/lib/core');

function TeamzUtils() {
}

TeamzUtils.OPEN_GROUP = 0;
TeamzUtils.CLOSE_GROUP = 1;

TeamzUtils.getNavURL = function(key) {
  return '?k=' + key;
};

TeamzUtils.getGroupURL = function(gid) {
  return '?gid=' + gid;
};

TeamzUtils.getURLParams = function(path) {
  var url = urllite(path);
  return TeamzUtils.parseURLParams(url.search);
};

TeamzUtils.parseURLParams = function(paramsString) {
  var parsed = {};
  if (paramsString.indexOf('?') === 0) paramsString = paramsString.slice(1);
  var pairs = paramsString.split('&');
  pairs.forEach(function(pair) {
    var keyVal = pair.split('=');
    parsed[decodeURIComponent(keyVal[0])] = decodeURIComponent(keyVal[1]);
  });
  return parsed;
};

TeamzUtils.isGroupOpen = function(privacy) {
  return privacy == TeamzUtils.OPEN_GROUP;
};
