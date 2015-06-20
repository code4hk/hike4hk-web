var React = require('react');

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
        <div>username: {user.username}</div>
        <div>
        {
          this.state.activities.map(function(a){
            return <div key={a.id}>{a.distance}</div>
          })
        }
        </div>
      </div>
    </div>
  }
});

module.exports = Profile;