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


function formatTime(n){
  if( n <= 0 ) return '00:00:00';
  var pad = function(x){
    return x < 10 ? '0' + x : x.toString();
  };
  n = Math.round(n/1000);
  var ss = n % 60;
  n = (n-ss)/60;
  var mm = n % 60;
  n = (n-mm)/60;
  var hh = n % 60;
  return pad(hh) + ':' + pad(mm) + ':' + pad(ss);
}

var Profile = React.createClass({
  mixins: [],
  getDefaultProps: function(){
    // must user
    return {};
  }
  ,
  getInitialState: function(){
    return {
      activities: []
    };
  }
  ,
  componentDidMount: function(){
    var self = this;
    var user = this.props.user;
    api.Activity.listByUser(user.id, function(err, activities){
      self.setState({ activities: activities });
    })
  }
  ,
  componentWillUnmount: function(){
  }
  ,
  render: function(){
    var user = this.props.user;

    return <div className="profile">
      <div className="container">
        <div className="content" >
          <div>username: {user.username}</div>
          <div>email: {user.email}</div>
          <div>weight: {user.weight} kg</div>
          <div>height: {user.height} m</div>
        </div>
        <table className="ui table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Distance</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.activities.map(function(a){
              var s = a.start_time;
              var e = a.end_time;
              var duration = s && e ? formatTime(e-s) : '--';
              var distance = a.distance >= 1000 ? (a.distance/1000).toFixed(1) + 'km' : a.distance + 'm';
              var date = formatDate(new Date(s));

              return <tr key={a.id}>
                <td>{date}</td>
                <td>{distance}</td>
                <td>{duration}</td>
              </tr>
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  }
});

module.exports = Profile;