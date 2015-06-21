var React = require('react');

function formatDate(d){
  var pad = function(n){
    var s = n.toString();
    if( s.length === 1 ) return '0' + s;
    return s;
  };
  var y = d.getFullYear();
  var m = pad(d.getMonth()+1);
  var dd = pad(d.getDate());
  var val = [y,m,dd].join('-');
  return val;
}

//
//function formatTime(n){
//  if( n <= 0 ) return '00:00:00';
//  var pad = function(x){
//    return x < 10 ? '0' + x : x.toString();
//  };
//  n = Math.round(n/1000);
//  var ss = n % 60;
//  n = (n-ss)/60;
//  var mm = n % 60;
//  n = (n-mm)/60;
//  var hh = n % 60;
//  return pad(hh) + ':' + pad(mm) + ':' + pad(ss);
//}

var Event = React.createClass({
  mixins: [],
  getDefaultProps: function(){
    // must user
    return {};
  }
  ,
  getInitialState: function(){
    return {
      events: []
    };
  }
  ,
  componentDidMount: function(){
    var self = this;
    api.Event.list(function(err, events){
      self.setState({ events: events });
    })
  }
  ,
  componentWillUnmount: function(){
  }
  ,
  render: function(){
    return <div className="events">
      <div className="container">
        <div className="ui cards">
          {
            this.state.events.map(function(e) {
              var st = formatDate(new Date(e.start_time));
              var et = formatDate(new Date(e.end_time));
              return <div key={e.id} className="card">
                <div className="image">
                  <img src="/img/ph200.png"/>
                </div>
                <div className="content">
                  <a className="header">{e.name}</a>
                  <div className="meta">
                    <span className="date">{st}</span>
                  </div>
                  <div className="description">{e.description}</div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  }
});

//<table className="ui table">
//  <thead>
//  <tr>
//    <th>Title</th>
//    <th>From</th>
//    <th>To</th>
//    <th></th>
//  </tr>
//  </thead>
//  <tbody>
//  {
//    this.state.events.map(function(e){
//      return <tr key={e.id}>
//        <td>{e.name}</td>
//        <td>{formatDate(new Date(e.start_time))}</td>
//        <td>{formatDate(new Date(e.end_time))}</td>
//        <td>
//          <div className="ui purple button">join</div>
//        </td>
//      </tr>
//    })
//  }
//  </tbody>
//</table>

module.exports = Event;