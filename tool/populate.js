var Log = require('../src/lib/Log.js');
var db = require('../src/model/model.js');
var User = require('../src/model/User.js');
var Activity = require('../src/model/Activity.js');
var Event = require('../src/model/Event.js');
var U = require('../src/lib/server_utility.js');

function populateUser(done){
  User.delAll(function(err){
    if(err) Log.e(err);
    else User.populate(20, function(err){
      if(err) Log.e(err);
      else done();
    })
  });

}

function populateActivity(done){
  Activity.delAll(function(err){
    if(err) Log.e(err);
    else Activity.populate(200, function(err){
      if(err) Log.e(err);
      else done();
    });
  });
}

function populateEvent(done){
  Event.delAll(function(err){
    if(err) Log.e(err);
    else Event.populate(8, function(err){
      if(err) Log.e(err);
      else done();
    });
  });
}

U.sequence([ populateUser, populateEvent, populateActivity, function(){
  Log.i('done');
  process.exit();
}]);



