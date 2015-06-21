var React = require('react');
var If = require('../component/If.jsx');
var SignIn = require('./SignIn.jsx');
var Profile = require('./Profile.jsx');
var Events = require('./Events.jsx');
var Home = require('./Home.jsx');

L.mapbox.accessToken = "pk.eyJ1IjoiY29kZTRoayIsImEiOiI2YmMwMTRmNWU4YWE2ZjRkNTI5ZjRhZmI3NzUxNzFhYyJ9.Bs7gyvpywRclaZ6CZ6-s3w";

var Frame = React.createClass({
  mixins: [],
  getDefaultProps: function(){
    return {};
  }
  ,
  getInitialState: function(){
    return {
      user: null,
      tab: 'home'
    };
  }
  ,
  componentDidMount: function(){
    // testing
    //this._onSignIn('user1', '');
  }
  ,
  componentWillUnmount: function(){
  }
  ,
  _tab: function(name){
    var self = this;
    return function(){
      self.setState({ tab: name });
    }
  }
  ,
  _onSignIn: function(username, password){
    var self = this;
    api.User.getByUsername(username, password, function(err, profile){
      if(err) log(err);
      else self.setState({ user: profile, tab: 'profile' });
    })
  }
  ,
  _logout: function(){
    this.setState({ user: null, tab: 'event' });
  }
  ,
  render: function(){
    var login = this.state.user !== null;

    //<If value={this.state.user === null} >Sign In</If>
    return <div className="frame">
      <header>
        <div className="container">
          <div className="title" onClick={this._tab('home')} >Hike4hk</div>
            <div className="tabs">
              <div onClick={this._tab('event')}>Events</div>
              <If value={this.state.user !== null} onClick={this._tab('profile')}>Profile</If>
              <If value={this.state.user !== null} onClick={this._logout} >Log out</If>
              <If value={this.state.user === null} onClick={this._tab('sign_in')}>Sign In</If>
            </div>
        </div>
      </header>

      <If value={this.state.tab === 'home'}>
        <Home />
      </If>

      <If className="sign-in-box" value={this.state.tab === 'sign_in'}>
        <SignIn onSignIn={this._onSignIn} />
      </If>

      <If value={login && this.state.tab === 'profile'}>
        <Profile user={this.state.user} />
      </If>

      <If value={this.state.tab  === 'event'}>
        <Events />
      </If>

      <footer></footer>
    </div>
  }
});

module.exports = Frame;
