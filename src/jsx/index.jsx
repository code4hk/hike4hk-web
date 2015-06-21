var React = require('react');
var Frame = require('./partial/Frame.jsx');

require('whatwg-fetch');
require('promise.prototype.finally');

window.log = console.log.bind(console);

///////////////////////////////////////////////////////////
/// initialization

// build api
function makeApi(api){
  if( Array.isArray(api) ){
    var type = api[0];
    if( type === 'call' ){
      return function(){
        socket.emit(api[1], {
          args: Array.prototype.slice.call(arguments)
        })
      }
    }
    else if( type === 'request' ){
      return function(){
        var len = arguments.length;
        if( len === 0 || typeof arguments[len-1] !== 'function' )
          throw new Error('request without callback');
        var args = Array.prototype.slice.call(arguments,0,len-1);
        var cb = arguments[len-1];
        fetch(api[1], {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(args)
        }).then(function(res){
          return res.json();
        }).then(function(data){
          cb.apply(null, data);
        }).catch(function(ex){
          log(ex);
        });
      }
    }
  }
  else if( typeof api === 'object' ){
    var t = {};
    for(var key in api ) t[key] = makeApi(api[key]);
    return t;
  }
}

fetch('/api.js').then(function(res){
  return res.json();
}).then(function(j){
  window.api = makeApi(j);
}).finally(function(){
  React.render(<Frame />, document.body);
});
