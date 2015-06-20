var log = console.log.bind(console);

function nextTick(f){
  process.nextTick(f);
}

// half-inclusive
// serialFor(start,end,action,[callback])
// serialFor(n,action,callback) = serialFor(0,n,action,callback)
function serialFor(start, end, action, callback){
  if(typeof end === 'function') {
    callback = action;
    action = end;
    end = start;
    start = 0;
  }

  var called = new Array(end-start);
  for(var i=0; i<called.length; i++) called[i] = false;
  var done = function(i){
    return function(){
      if( !called[i] ){
        called[i] = true;
        var j = i+1;
        if(j < end) nextTick(function(){
          action.call(null, j, done(j));
        });
        else if( typeof callback === 'function') nextTick(function(){
          callback.call();
        });
      }
      else throw new Error('multiple call to action');
    }
  };
  nextTick(function(){
    action.call(null, start, done(start));
  });
}
// parallelFor(start,end,action,[callback])
// parallelFor(n,action,callback) = parallelFor(0,n,action,callback)
function parallelFor(start, end, action, callback){
  if(typeof end === 'function'){
    callback = action;
    action = end;
    end = start;
    start = 0;
  }

  var called = new Array(end-start);

  var cnt = end-start;
  var run = function(i){
    nextTick(function(){
      action.call(null, i, function(){
        if( !called[i] ){
          called[i] = true;
          cnt -= 1;
          if(cnt === 0 && typeof callback === 'function'){
            nextTick(function(){
              callback.call();
            });
          }
        }
        else throw new Error('multiple call to action');
      });
    });
  };
  for(var i=start; i<end; i++){
    called[i] = false;
    run(i);
  }
}
// common pattern
// @param {Array<function(done)>} arr
function sequence(arr){
  serialFor(arr.length, function(i, done){
    arr[i].call(null, done);
  })
}

var constant = function(x){ return function(){ return x; }};
var isUndefined = function(x){ return typeof x === 'undefined' };
var isNull = function(x){ return x === null };
var isFalsity = function(x){ return isUndefined(x) || isNull(x) };
var isFunction = function(x){ return typeof x === 'function' };
var isArray = Array.isArray;
function isInteger(n){
  return n.match(/^\d+$/) !== null;
}

function isNumber(n){
  return n.match(/^\d+\.?\d*$/) !== null;
}

var parseNum = function(x, val){
  if(x === null) return val;
  x = +x;   // +null == 0
  return isNaN(x) ? val : x;
};

// random
var random = function(a,b){
  var args = arguments;
  if(args.length === 0) return Math.random();
  if(args.length === 1) return Math.floor(Math.random()*a); // half-inclusive
  return a + Math.floor((b-a+1)*Math.random()); // [a,b] inclusive
};

var randomDate = function(a,b){
  var t = random(a.getTime(), b.getTime());
  var d = new Date(t);
  return formatDate(d);
};

function formatDate(d){
  var pad = function(n){
    var s = n.toString();
    if( s.length === 1 ) return '0' + s;
    return s;
  };
  var y = d.getFullYear();
  var m = pad(d.getMonth()+1);
  var dd = pad(d.getDate());
  return [y,m,dd].join('-');
}

const padLeft = function(n, len, elem){
  var s = n.toString();
  while( s.length < len  ) s = elem + s;
  return s;
};

function formatNumber(n){
  if( n === 0 ) return '0';
  var arr = [];
  var sign = n < 0 ? '-' : '';
  var fraction = n - Math.floor(n);
  fraction = fraction === 0 ? '.00' : fraction.toFixed(2).slice(1,4);
  n = Math.round(n-fraction);
  n = Math.abs(n);
  while(n > 0){
    arr.unshift( n%1000 );
    n = Math.floor(n/1000);
  }
  for(var i=1; i<arr.length;i++) arr[i] = padLeft(arr[i], 3, '0');
  return sign + arr.join(',') + fraction;
}

var today = function(){
  return formatDate(new Date());
};

var nextMonth = function(){
  var d = Date.now();
  var n = new Date(d.getFullYear(), d.getMonth()+1, d.getDate());
  return formatDate(n);
};

function objectKeyValMap(obj, map){
  var arr = [];
  for(var key in obj){
    if( ! obj.hasOwnProperty(key) ) continue;
    arr.push(map.call(null, key, obj[key], arr));
  }
  return arr;
}

function arrayGroupBy(arr, groupOf){
  var groups = {};
  for(var i=0; i<arr.length; i++){
    var x = arr[i]
    var g = groupOf(x);
    var lis = groups[g];
    if( Array.isArray(lis) ) lis.push(x);
    else groups[g] = [x];
  }
  return groups;
}

module.exports = {
  serialFor: serialFor,
  parallelFor: parallelFor,
  sequence: sequence,
  constant: constant,
  isUndefined: isUndefined,
  isNull: isNull,
  isFalsity: isFalsity,
  isFunction: isFunction,
  isArray: isArray,
  parseNum: parseNum,
  random: random,
  randomDate: randomDate,
  formatDate: formatDate,
  formatNumber: formatNumber,
  today: today,
  keyValMap: objectKeyValMap,
  arrayGroupBy: arrayGroupBy
};