var Log = require('../src/lib/Log.js');
var db = require('../src/model/model.js');


db.createAllTable(function(err){
  if(err) Log.e(err);
  else Log.i('done');
  process.exit(0);
});