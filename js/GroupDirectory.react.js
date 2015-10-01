var Parse = require('parse').Parse;
var React = require('react');
var ParseReact = require('parse-react');

var ListGroup = require('react-bootstrap/lib/ListGroup');
var ListGroupItem = require('react-bootstrap/lib/ListGroupItem');
var Panel = require('react-bootstrap/lib/Panel');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var Button = require('react-bootstrap/lib/Button');
var ModalTrigger = require('react-bootstrap/lib/ModalTrigger');

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
        <ModalTrigger modal={<SignInSignUpModal />}>
          <Button bsStyle='primary'>Sign In to create your groups</Button>
        </ModalTrigger>
      );
    }

    createButton = Parse.User.current() ? 
      (<Button>Create</Button>) : 
      (<Button disabled>Create</Button>);

    return (
      <div className={this.pendingQueries().length ? 'group_list loading' : 'group_list'}>
        <div className="pull-right">
          <ButtonToolbar>
            <ButtonGroup>
              <Button>Search</Button>
              <ModalTrigger modal={<GroupCreateModal />}>
                {createButton}
              </ModalTrigger>
              <Button onClick={this._refresh}>Refresh</Button>
            </ButtonGroup>
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
