var React = require('react');

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

    function addRouteByUrl(url){
      fetch(url).then(function(res) {
        return res.json();
      }).then(function(geojson){
        addAnimatedRoute(geojson);
      })
    }

    this.props.routeSources.forEach(function(routeSource){
      addRouteByUrl(routeSource);
    });
  },

  render: function() {
    return (
      <div>
        <div ref='map' className='pin-top pin-bottom' id='map'></div>
      </div>
    );
  }
});

module.exports = HikingViz;

