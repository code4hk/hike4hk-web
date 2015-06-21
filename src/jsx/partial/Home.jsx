var React = require('react');

var routeSources = ["examples/sample.geojson","examples/dragonback.geojson","examples/wilson.geojson"];
var HikingViz = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    };
  },

  componentDidMount: function() {
    var MAP = 'mapbox.outdoors';
    var HKI = [22.2555200, 114.1776900];
    var NT = [22.4370259,114.1616826];
    this.map = L.mapbox.map(this.refs.map.getDOMNode(), MAP, {
      center: HKI,
      zoom: 13
    });
    this.map.scrollWheelZoom.disable();
    //unknown hack
    window.map = this.map;

    function addAnimatedRoute(geojson){
      var line = geojson.features[0].geometry;
        // console.log(res.response.features[0].geometry)

        // Add this generated geojson object to the map.
        L.geoJson(geojson).addTo(this.map);
        // this.map.featureLayer.setGeoJSON(geojson);

        // Create a counter with a value of 0.
        var j = 0;
        var userIcon = L.icon({
        iconUrl: 'examples/e.jpg',
        // shadowUrl: 'leaf-shadow.png',

        iconSize:     [58, 75], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 70], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var marker = L.marker([0, 0], {
      icon: userIcon
    }).addTo(this.map);

    tick(marker,line);

    function tick(marker,line) {
        // Set the marker to be at the same point as one
        // of the segments or the line.
        marker.setLatLng(L.latLng(
            line.coordinates[j][1],
            line.coordinates[j][0]));
        // Move to the next point of the line
        // until `j` reaches the length of the array.
        if (++j < line.coordinates.length) setTimeout(tick.bind(this,marker,line), 10);
    }
  }
  //
    function addRouteByUrl(url){
      fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function(geojson){
        addAnimatedRoute(geojson);
      })
    }
  //
  //   console.log(this.props.routeSources);
  //
    this.props.routeSources.forEach(function(routeSource){
          addRouteByUrl(routeSource);
    })



  //   reqwest({
  //     url: this.props.source
  //   })
  //   .then(function (res) {
  //     var lastGist = res[0];
  //     if (this.isMounted()) {
  //       this.setState({
  //         username: lastGist.owner.login,
  //         lastGistUrl: lastGist.html_url
  //       });
  //     }
  //   // qwery('#content').html(resp.content)
  // }.bind(this), function (err, msg) {
  //   // qwery('#errors').html(msg)
  // })
  },

  render: function() {
    return (
      <div>
        <div ref='map' className='pin-top pin-bottom' id='map'></div>
      </div>
    );
  }
});


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
