var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

var Id = require('parse-react/lib/react-native/Id');
var Button = require('react-bootstrap/lib/Button');
var Input = require('react-bootstrap/lib/Input');
var Modal = require('react-bootstrap/lib/Modal');
var Panel = require('react-bootstrap/lib/Panel');

var TeamzUtils = require('./TeamzUtils.js');

var GroupCreateModal = React.createClass({
  getInitialState: function() {
    return ({
      name: '',
      privacy: TeamzUtils.OPEN_GROUP
    });
  },

  render: function() {
    if (!this.props.show) {
      return <span />;
    } else {
      return (
        <Modal
          show={this.props.show} 
          animation={true}
          onHide={this.props.onHide}
          >
          <Modal.Header closeButton>
            <Modal.Title>Create a group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className='form-horizontal'>
              <Input 
                type='text' 
                label='Name' 
                labelClassName='col-xs-2' 
                wrapperClassName='col-xs-10'
                placeholder={"e.g. Awesome team, best friends"} 
                onChange={this._onNameChange} />
              <Input 
                type='checkbox' 
                label='Open group'
                checked='true'
                wrapperClassName='col-xs-offset-2 col-xs-10' 
                help='The public can find and join the group' 
                onChange={this._onOpenGroupChange} />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Cancel</Button>
            <Button onClick={this._onCreateGroup} bsStyle='primary'>Create group</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    },

  _onNameChange: function(e) {
    this.setState({
      name: e.target.value
    });
  },

  _onOpenGroupChange: function(e) {
    this.setState({
      privacy: e.target.checked ? TeamzUtils.OPEN_GROUP : TeamzUtils.CLOSE_GROUP
    });
  },

  // A Create mutation takes a className and a set of new attributes
  _onCreateGroup: function() {
    var self = this;
    ParseReact.Mutation.Create('Group', {
      name: this.state.name,
      privacy: this.state.privacy
    }).dispatch().then(function (resultGroup) {
      var user = new Id('_User', Parse.User.current().id);
      ParseReact.Mutation.AddRelation(user, 'subscriptions', resultGroup).dispatch();
      self.setState({
        show: false,
        name: '',
        privacy: TeamzUtils.OPEN_GROUP
      });
    });
  }
});

module.exports = GroupCreateModal;
