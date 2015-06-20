var React = require('React');

module.exports = React.createClass({
  mixins: [],
  getDefaultProps: function(){
    return {
      value: true
    };
  }
  ,
  getInitialState: function(){
    return {};
  }
  ,
  componentDidMount: function(){
  }
  ,
  componentWillUnmount: function(){
  }
  ,
  render: function(){
    if( this.props.value ) return <div {...this.props} />;
    return <noscript />;
  }
});