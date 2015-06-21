var React = require('react');
var HikingViz = require('./HikingViz.jsx');

///////////////////////////////////////////////////////////

var routeSources = [
  "examples/sample.geojson",
  "examples/dragonback.geojson",
  "examples/wilson.geojson"
];

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

///////////////////////////////////////////////////////////

var Home = React.createClass({
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
    return <div className="home">
      <div className="banner">
        <h1>Hike better, Together for hk</h1>
      </div>
      <div>
        <HikingViz source="https://api.github.com/users/octocat/gists" routeSources={routeSources}/>
      </div>
      <div className="how-it-works">
        <h1>Converting Calories to Donations</h1>
          <div className="steps">
            <div className="step">
              <header>Calories this week</header>
              <p>3,231,321</p>
            </div>
            <div className="step">
              <header>Donations this week</header>
              <p>$124,512</p>
            </div>
            <div className="step">
              <header>All Donations</header>
              <p>$123,432,234</p>
            </div>
          </div>
      </div>
      <div className="get-started">
        <h1>Create Your Own ❤ Hike</h1>
        <div className="ui green big button">Get Started</div>
      </div>
    </div>
  }
});


module.exports = Home;
