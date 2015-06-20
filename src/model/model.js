var Log = require('../lib/Log.js');
var db = require('../lib/mysql.js');
var U = require('../lib/server_utility.js');

///////////////////////////////////////////////////////////

exports.createAllTable = function(callback){
  var stmt = `
create table if not exists User (
  id                int               auto_increment,
  username          varchar(255)      not null,
  email             varchar(255)      not null,
  password_salt     varchar(64)       not null,
  password_hash     varchar(255)      not null,

  join_time         bigint            not null,
  verified          bool              not null,

  weight            double            ,
  height            double            ,

  -- total_distance for all events in meter
  total_distance    double            default 0,

  is_deleted        bool              default 0,

  primary key(id),
  unique index(username),
  unique index(email)
);

create table if not exists Activity (
  id                int                 auto_increment,
  user_id           int                 not null,

  distance          int               ,
  start_time        bigint            ,
  end_time          bigint            ,

  is_deleted        bool              default 0,

  primary key(id),
  foreign key(user_id) references User(id)
);

create table if not exists Event (
  id                  int               auto_increment,

  name                varchar(255)      not null,
  start_time          bigint            not null,
  end_time            bigint            not null,
  description         text              default '',

  is_deleted          bool              default 0,

  primary key(id),
  index(start_time),
  index(end_time)
);

create table if not exists Activity_Event (
  id                int               auto_increment,
  event_id          int               not null,
  activity_id       int               not null,

  is_deleted        bool              default 0,

  primary key(id),
  foreign key(event_id) references Event(id),
  foreign key(activity_id) references Activity(id)
);

create table if not exists Achievement (
  id                int                 auto_increment,
  name              varchar(255)        not null,

  is_deleted        bool                default 0,

  primary key(id)
);

create table if not exists Achievement_User (
  id                int               auto_increment,
  user_id           int               not null,
  achievement_id    int               not null,

  is_deleted        bool              default 0,

  primary key(id),
  foreign key(user_id) references User(id),
  foreign key(achievement_id) references Achievement(id)
);

  `;
  const cb = function(err){
    if( U.isFunction(callback) ){
      if(err) callback.call(null, err);
      else callback.call()
    }
  };
  db.query(stmt, cb);
};

exports.dropAllTable = function(callback){
  const stmt = `
    drop table if exists Achievement_User, Achievement, Activity_Event, Activity, User,  Event;
  `;
  db.query(stmt, function(err){
    if( U.isFunction(callback) ){
      if(err) callback.call(null, err);
      else callback.call();
    }
  })
};

///////////////////////////////////////////////////////////

exports.makeAdd = function(tableName){
  return function(data, callback){
    var stmt = `insert into ${tableName} set ?;`;
    var args = [data];
    var cb = function(err, res){
      if( U.isFunction(callback) ){
        if(err){
          Log.e(err);
          callback.call(null, err);
        }
        else callback.call(null, null, res && res.insertId);
      }
    };
    db.query(stmt, args, cb)
  }
};

exports.makeList = function(tableName, fields, condition){
  // offset: starting index 0-based
  // limit: maximum number of row returned
  return function(callback){
    var stmt = `
      select
        ${fields}
      from
        ${tableName}
      where
        ${condition}
    `;
    var cb = function(err, rows, fields){
      if( U.isFunction(callback) ){
        if(err) callback.call(null, err);
        else callback.call(null, null, rows, fields);
      }
    };
    db.query(stmt, cb);
  }
};

exports.makeListLimit = function(tableName, fields, condition){
  // offset: starting index 0-based
  // limit: maximum number of row returned
  return function(offset, limit, callback){
    var stmt = `
      select
        ${fields}
      from
        ${tableName}
      where
        ${condition}
      limit ?, ?;
    `;
    var args = [offset, limit];
    var cb = function(err, rows, fields){
      if( U.isFunction(callback) ){
        if(err) callback.call(null, err);
        else callback.call(null, null, rows, fields);
      }
    };
    db.query(stmt, args, cb);
  }
};

exports.makeGet = function(tableAlias, selectTable, fields, condition){
  return function(id, callback){
    var stmt = `
      select
        ${fields}
      from
        ${selectTable}
      where
        ${tableAlias}id = ? and
        ${condition}
    `;
    var args = [id];
    var cb = function(err, rows){
      if( U.isFunction(callback) ){
        if(err) callback.call(null, err);
        else callback.call(null, null, rows.length ? rows[0] : null);
      }
    };
    db.query(stmt, args, cb)
  };
};

exports.makeRandom = function(tableName, fields, condition){
  return function(callback) {
    var stmt = `
      select
        ${fields}
      from
        ${tableName}
      where
        ${condition}
      order by rand() limit 1;
    `;
    db.query(stmt, function (err, rows) {
      if( U.isFunction(callback) ) {
        if (err) callback.call(null, err);
        else callback.call(null, null, rows.length ? rows[0] : null);
      }
    })
  }
};


exports.makePatch = function(tableName){
  return function(id, data, callback){
    var stmt = `update ${tableName} set ? where id=?;`;
    var args = [data, id];
    var cb  =function(err, res){
      if( U.isFunction(callback) ){
        if(err){
          Log.e(err);
          callback.call(null, err);
        }
        else callback.call(null, null, res && res.changedRows);
      }
    };
    db.query(stmt, args, cb);
  }
};

exports.makeDel = function(tableName){
  return function(id, callback){
    var stmt = `delete from ${tableName} where id = ?;`;
    var args = [id];
    var cb = function(err, res){
      if( err ){
        Log.e(err);
        callback.call(null, err);
      }
      else callback.call(null, null, res && res.affectedRows );
    };
    db.query(stmt, args, cb);
  }
};

exports.makeMultiDel = function(tableName){
  return function(ids, callback){
    var stmt = `delete from ${tableName} where id in (?);`;
    var args = [ids];
    var cb = function(err, res){
      if( err ){
        Log.e(err);
        callback.call(null, err);
      }
      else callback.call(null, null, res && res.affectedRows );
    };
    db.query(stmt, args, cb);
  }
};

exports.makeSetIsDeleted = function(tableName){
  return function(id, callback){

    var stmt = `
      update ${tableName} set
        is_deleted = true
      where
        id = ?;
    `;
    var args = [id];
    var cb = function(err, res){
      if( U.isFunction(callback) ){
        if(err){
          Log.e(err);
          callback.call(null, err);
        }
        else callback.call(null, null, res && res.affectedRows );
      }
    };
    db.query(stmt, args, cb)
  }
};

exports.makeDelAll = function(tableName){
  return function(callback){
    var stmt = `delete from ${tableName};`;
    var cb = function(err, rows){
      if( U.isFunction(callback) ){
        if(err) callback.call(null, err);
        else callback.call(null, null, rows && rows.affectedRows);
      }
    };
    db.query(stmt, cb);
  }
};

exports.makeExport = function(tableName){
  return function(callback){
    var stmt = `select * from ${tableName};`;
    db.query(stmt, function(err, rows){
      if( U.isFunction(callback) ){
        if(err) callback.call(null, err);
        else callback.call(null, null, rows);
      }
    })
  }
};

exports.makeDrop = function(tableName){
  return function(callback){
    var stmt = `drop table if exists ${tableName};`;
    db.query(stmt, function(err){
      if( U.isFunction(callback) ){
        if(err) callback.call(null, err);
        else callback.call()
      }
    });
  };
};

exports.makePopulate = function(tableName, generate){
  var add = exports.makeAdd(tableName);
  var ids = [];
  return function(len, callback){
    U.serialFor(
      len,
      function(i, done){
        generate(function(obj){
          add(obj, function(err, insertId){
            if(err) Log.e(err);
            else ids.push(insertId);
            done();
          })
        });
      },
      function(){
        callback(null, ids);
      }
    );
  }
};