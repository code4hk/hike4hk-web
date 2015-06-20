var model = require('./model.js');
var db = require('../lib/mysql.js');
var U = require('../lib/server_utility.js');
var Log = require('../lib/Log.js');
var Faker = require('faker');

var tableName = 'User';
exports.add         = model.makeAdd(tableName);
exports.patch       = model.makePatch(tableName);
exports.del         = model.makeSetIsDeleted(tableName);
exports.delAll      = model.makeDelAll(tableName);
exports.drop        = model.makeDrop(tableName);
exports.export      = model.makeExport(tableName);

var tableAlias = 'u.';
var selectTable = `
  User as u
`;
var fields = `
  u.id,
  u.username,
  u.email,
  u.password_salt,
  u.password_hash,
  u.join_time,
  u.verified,
  u.weight,
  u.height,
  u.total_distance
`;
var condition = `
  u.is_deleted = false
`;

exports.list = model.makeList(selectTable, fields, condition);
exports.listLimit = model.makeListLimit(selectTable, fields, condition);
exports.get = model.makeGet(tableAlias, selectTable, fields, condition);
exports.random = model.makeRandom(selectTable, fields, condition);


exports.getByUsername = function(username, password, callback){
  var stmt = `select ${fields} from ${selectTable} where u.username = ? and ${condition} limit 1;`;
  db.query(stmt, [username], function(err, user){
    if(err) Log.e(err);
    callback(err, user && user[0]);
  });
};

var cnt = 0;
exports.populate = model.makePopulate(tableName, function(callback){
  callback({
    username: 'user' + ++cnt,
    email: Faker.Internet.email()
  })
});

//exports.join = function(userId, eventId, callback){
//  var stmt = `
//    insert into Event_User set user_id = ?, event_id = ?;
//  `;
//  db.query(stmt, [userId, eventId], function(err){
//    if(err) Log.e(err);
//    callback.apply(null, arguments);
//  });
//};

///////////////////////////////////////////////////////////

exports.add.requestableAsync = true;
exports.patch.requestableAsync = true;
exports.del.requestableAsync = true;
exports.list.requestableAsync = true;
exports.listLimit.requestableAsync = true;
exports.get.requestableAsync = true;

exports.getByUsername.requestableAsync = true;