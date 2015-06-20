function PubSub(){
  this.handlers = {};
}

PubSub.prototype.pub = function(event) {
  var hs = this.handlers[event];
  if( !hs )  return;
  var args = Array.prototype.slice.call(arguments, 1);
  for(var i=0; i<hs.length; i++){
    hs[i].apply(null, args);
  }
};

PubSub.prototype.sub = function(event, handler) {
  var hs = this.handlers[event] || [];
  hs.push(handler);
  this.handlers[event] = hs;
  return [event, handler];
};

PubSub.prototype.unsub = function(id) {
  var event = id[0];
  var handler = id[1];
  var hs = this.handlers[event];

  for(var i=0; i<hs.length; i++){
    if( hs[i] === handler ) hs.splice(i, 1);
  }
};

PubSub.prototype.clearAll = function(){
  this.handlers = {}
};

module.exports = PubSub;