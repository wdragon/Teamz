var Parse = require('parse').Parse;
var React = require('react');
var ParseReact = require('parse-react');

var Button = require('react-bootstrap/lib/Button');

var LoadMore = React.createClass({

  getInitialState: function() {
    return ({
      isLoading: this.props.isLoading,
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({isLoading: nextProps.isLoading});
  },

  onClick(e) {
    this.setState({isLoading: true});
    this.props.onClick(e);
  },

  render: function() {
    return (
      <Button
        block
        disabled={this.state.isLoading}
        onClick={!this.state.isLoading ? this.onClick : null}>
        {this.state.isLoading ? 'Loading...' : 'See More'}
      </Button>
    );
  }
});

module.exports = LoadMore;
