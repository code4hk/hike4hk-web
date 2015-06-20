var React = require('react');

var SignIn = React.createClass({
  mixins: [],
  getDefaultProps: function(){
    return {};
  }
  ,
  getInitialState: function(){
    return {
      username: '',
      password: ''
    };
  }
  ,
  componentDidMount: function(){
  }
  ,
  componentWillUnmount: function(){
  }
  ,
  _onSubmit: function(){
    var cb = this.props.onSignIn;
    if( typeof cb === 'function' ) cb(this.state.username, this.state.password);
  }
  ,
  _onUsernameChange: function(event){
    this.setState({ username: event.target.value });
  }
  ,
  _onPasswordChange: function(event){
    this.setState({ password: event.target.value });
  }
  ,
  render: function(){
    return <div className="sign-in">
      <div className="ui form" >
        <div className="field">
          <input type="text" placeholder="User Name" onChange={this._onUsernameChange} />
        </div>
        <div className="field">
          <input type="password" placeholder="Password" onChange={this._onPasswordChange} />
        </div>
        <div className="ui teal button" onClick={this._onSubmit} >Enter</div>
      </div>
    </div>
  }
});

module.exports = SignIn;