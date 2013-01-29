var util  = require("util");
var url   = require("url");
var redis = require("redis");

module.exports.createClient = function(){
  var client;

  if (process.env.REDISTOGO_URL) {
    var address = url.parse(process.env.REDISTOGO_URL);
    client = redis.createClient(address.port, address.hostname);
    client.auth(address.auth.split(":")[1]);
  }
  else if (process.env.REDIS_URL) {
    // REDIS_URL=redis://<ip>:<port>/0
    var address = url.parse(process.env.REDIS_URL);
    if (!address.port) address.port = 6379;
    client = redis.createClient(address.port, address.hostname);
  } else {
    client = redis.createClient();
  }

  // Prevent redis calling exit
  client.on("error", function(error){
    util.error(error);
  });

  return client;
};
