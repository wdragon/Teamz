var Parse = require('parse').Parse;
var React = require('react');
var ParseReact = require('parse-react');

var ListGroup = require('react-bootstrap/lib/ListGroup');
var ListGroupItem = require('react-bootstrap/lib/ListGroupItem');
var Panel = require('react-bootstrap/lib/Panel');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var Button = require('react-bootstrap/lib/Button');

var GroupCreateModal = require('./GroupCreateModal.react.js');
var SignInSignUpModal = require('./SignInSignUpModal.react.js');
var TeamzUtils = require('./TeamzUtils.js');

var GroupDirectory = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function(props, state) {
    if (Parse.User.current()) {
      return {
        groups: Parse.User.current().relation('subscriptions').query()
      };
    } else {
      return {};
    }
  },

  getInitialState() {
    return {
      showGroupCreateModal: false,
      showSigninModal: false,
    };
  },

  onShowGroupCreateModal() {
    this.setState({showGroupCreateModal: true});
  },

  onShowSigninModal() {
    this.setState({showSigninModal: true});
  },

  onHideGroupCreateModal() {
    this.setState({showGroupCreateModal: false});
  },

  onHideSigninModal() {
    this.setState({showSigninModal: false});
  },

  render: function() {
    var self = this;
    var userGroups;
    var createButton;
    if (this.pendingQueries().length) {
      userGroups = (
        <div className="loading_indicator show" />
      );
    } else if (this.data.groups && this.data.groups.length) {
      userGroups = (
        <ListGroup fill>
        {this.data.groups.map(function(g) {
          var url = TeamzUtils.getGroupURL(g.objectId);
          return (
            <ListGroupItem className='group-link' href={url} group={g}><strong>{g.name}</strong></ListGroupItem> 
          );
        })}
        </ListGroup>
      );
    } else if (Parse.User.current()) {
      userGroups = "You haven't joined any groups yet.";
    } else {
      userGroups = (
        <div>
          <Button 
            bsStyle='primary'
            onClick={this.onShowSigninModal}>
            Sign In to create your groups
          </Button>
          <SignInSignUpModal 
            show={this.state.showSigninModal}
            onHide={this.onHideSigninModal}
          />
        </div>
      );
    }

    createButton = Parse.User.current() ? 
      (<Button onClick={this.onShowGroupCreateModal}>Create</Button>) : 
      (<Button disabled>Create</Button>);

    return (
      <div className={this.pendingQueries().length ? 'group_list loading' : 'group_list'}>
        <div className="pull-right">
          <ButtonToolbar>
            <ButtonGroup>
              <Button>Search</Button>
              {createButton}
              <Button onClick={this._refresh}>Refresh</Button>
            </ButtonGroup>
            <GroupCreateModal 
              show={this.state.showGroupCreateModal}
              onHide={this.onHideGroupCreateModal}
            />
          </ButtonToolbar>
        </div>
        <Panel collapsible defaultExpanded header='Your Groups'>
          {userGroups}
        </Panel>
      </div>
    );
  },

  _refresh: function() {
    this.refreshQueries('groups');
  },

  _searchGroup: function() {
    //(TODO) activate the search typeahead
  }
});

module.exports = GroupDirectory;
