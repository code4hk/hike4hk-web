var React = require('react');
var Frame = require('./partial/Frame.jsx');

window.log = console.log.bind(console);

///////////////////////////////////////////////////////////
/// socket

//var socket = new io();
//
//var models = [
//  { name: 'Board', handlers: Board },
//  { name: 'State', handlers: State }
//];
//
//// listen broadcast
//(function(){
//
//  for(var i=models.length; i--; ){
//    var model = models[i];
//    for(var key in model.handlers ){
//      var handler = model.handlers[key];
//      if( handler.callable ) (function(handler){
//        var event = [model.name, key].join('.');
//        //log('listening', event);
//        socket.on( event , function(data){
//          handler.apply(null, data.args);
//        })
//      })(handler);
//    }
//  }
//
//})();

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
        $.ajax({
          type: 'POST',
          url: api[1],
          contentType: 'application/json',
          data: JSON.stringify(args)
        }).done(function(data){
          cb.apply(null, data);
        })
      }
    }
  }
  else if( typeof api === 'object' ){
    var t = {};
    for(var key in api ) t[key] = makeApi(api[key]);
    return t;
  }
}

$.ajax({
  type: "GET",
  url: '/api.js'
}).done(function(json){
  window.api = makeApi(json);

  React.render(<Frame />, document.body);
});

