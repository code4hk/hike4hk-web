var model = require('./model.js');
var U = require('../lib/server_utility.js');
var Faker = require('faker');

var tableName = 'Event';
exports.add         = model.makeAdd(tableName);
exports.patch       = model.makePatch(tableName);
exports.del         = model.makeSetIsDeleted(tableName);
exports.delAll      = model.makeDelAll(tableName);
exports.drop        = model.makeDrop(tableName);
exports.export      = model.makeExport(tableName);

var tableAlias = 'e.';
var selectTable = `
  Event as e
`;
var fields = `
  e.id,
  e.name,
  e.start_time,
  e.end_time,
  e.description
`;
var condition = `
  e.is_deleted = false
`;

exports.list = model.makeList(selectTable, fields, condition);
exports.listLimit = model.makeListLimit(selectTable, fields, condition);
exports.get = model.makeGet(tableAlias, selectTable, fields, condition);
exports.random = model.makeRandom(selectTable, fields, condition);

var cnt = 0;
exports.populate = model.makePopulate(tableName, function(callback){
  var now = Date.now();
  var day = 1000*60*60*24;
  var s = now +  Math.floor(30*day*Math.random());
  var e = s +  Math.floor(30*day*Math.random());
  var name = 'Event' + ++cnt;
  callback({
    name: name,
    description: Faker.Lorem.paragraphs(),
    start_time: s,
    end_time: e
  });
});

///////////////////////////////////////////////////////////

exports.add.requestableAsync = true;
exports.patch.requestableAsync = true;
exports.del.requestableAsync = true;
exports.list.requestableAsync = true;
exports.listLimit.requestableAsync = true;
exports.get.requestableAsync = true;