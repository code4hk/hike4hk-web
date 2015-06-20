var React = require('react');
var If = require('../component/If.jsx');
var SignIn = require('./SignIn.jsx');
var Profile = require('./Profile.jsx');

var Frame = React.createClass({
  mixins: [],
  getDefaultProps: function(){
    return {};
  }
  ,
  getInitialState: function(){
    return {
      user: null,
      tab: 'profile'
    };
  }
  ,
  componentDidMount: function(){
    // testing
    this._onSignIn('user1', '');
  }
  ,
  componentWillUnmount: function(){
  }
  ,
  _onSignIn: function(username, password){
    var self = this;
    api.User.getByUsername(username, password, function(err, profile){
      if(err) log(err);
      else self.setState({ user: profile });
    })
  }
  ,
  render: function(){
    var login = this.state.user !== null;

    //<If value={this.state.user === null} >Sign In</If>
    return <div className="frame">
      <header>
        <div className="container">
          <div className="title">Hike4hk</div>
          <If className="tabs" value={this.state.user !== null}>
            <div>Profile</div>
            <div>Events</div>
            <div>Log out</div>
          </If>
        </div>
      </header>

      <If className="sign-in-box" value={!login}>
        <SignIn onSignIn={this._onSignIn} />
      </If>

      <If value={login && this.state.tab === 'profile'}>
        <Profile user={this.state.user} />
      </If>

      <If value={login && this.state.tab  === 'event'}>

      </If>

      <footer></footer>
    </div>
  }
});

module.exports = Frame;