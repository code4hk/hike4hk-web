var model = require('./model.js');
var db = require('../lib/mysql.js');
var Log = require('../lib/Log.js');
var U = require('../lib/server_utility.js');
var User = require('./User.js');

var tableName = 'Activity';
exports.add         = model.makeAdd(tableName);
exports.patch       = model.makePatch(tableName);
exports.del         = model.makeSetIsDeleted(tableName);
exports.delAll      = model.makeDelAll(tableName);
exports.drop        = model.makeDrop(tableName);
exports.export      = model.makeExport(tableName);

var tableAlias = 'a.';
var selectTable = `
  Activity as a, User as u
`;
var fields = `
  a.id,
  a.user_id,
  a.distance,
  a.start_time,
  a.end_time,
  u.username,
  u.email,
  u.weight,
  u.height
`;
var condition = `
  a.user_id = u.id and
  a.is_deleted = false
`;

exports.list = model.makeList(selectTable, fields, condition);
exports.listLimit = model.makeListLimit(selectTable, fields, condition);
exports.get = model.makeGet(tableAlias, selectTable, fields, condition);
exports.random = model.makeRandom(selectTable, fields, condition);

exports.populate = model.makePopulate(tableName, function(callback){
  var now = Date.now();
  var hour = 1000*60*60;
  var day = hour * 24;
  var e = now - 30*day*Math.random();
  var s = e - 5*hour*Math.random();
  User.random(function(err, u){
    callback({
      user_id: u.id,
      distance: Math.floor(1000 + Math.random() * 40 * 1000),
      start_time: s,
      end_time: e
    })
  });
});

exports.listByUser = function(userId, callback){
  var stmt = `
    select
      ${fields}
    from
      ${selectTable}
    where
      a.user_id = ? and
      ${condition}
    order by a.start_time desc;`;
  db.query(stmt, [userId], function(err, res){
    if(err) Log.e(err);
    callback(err, res);
  })
};

///////////////////////////////////////////////////////////

exports.add.requestableAsync = true;
exports.patch.requestableAsync = true;
exports.del.requestableAsync = true;
exports.list.requestableAsync = true;
exports.listLimit.requestableAsync = true;
exports.get.requestableAsync = true;

exports.listByUser.requestableAsync = true;