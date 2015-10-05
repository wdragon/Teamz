var Parse = require('parse').Parse;
var React = require('react');
var ParseReact = require('parse-react');

var PageHeader = require('react-bootstrap/lib/PageHeader');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var Button = require('react-bootstrap/lib/Button');
var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');

var GroupFeed = require('./GroupFeed.react.js');
var GroupAbout = require('./GroupAbout.react.js');
var TeamzUtils = require('./TeamzUtils.js');

var GROUP_FEED_NAV = 'groupFeed';
var GROUP_ABOUT_NAV = 'groupAbout';

var GroupHome = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function(props, state) {
    return { 
      'groups': new Parse.Query('Group').equalTo('objectId', props.groupId),
      'isMember': Parse.User.current().relation('subscriptions').query().equalTo('objectId', props.groupId)
    }
  },

  getInitialState: function() {
    return ({
      navKey: GROUP_FEED_NAV,
    });
  },

  renderError() {
    var errors = this.queryErrors();
    if (errors && errors.length) {
      return (
        <div>
          <div>Error encountered while loading the group ({this.props.groupId}):</div>
          {
            errors.map(function(error) {
              return (
                <Alert bsStyle='warning'>
                  {error.message}
                </Alert>
              );
            })
          }
        </div>
      );
    }
  },

  renderHeader() {
    if (this.pendingQueries().indexOf('groups') != -1) {
      return (<div className='groupHeader' />);
    } else {      
      var actions = (this.pendingQueries().indexOf('isMember')== -1)?
        (
          <div className="pull-right">
            <ButtonToolbar>
              {this.data.isMember.length == 0 ?
                <Button>Join</Button> :
                (<ButtonGroup>
                   <Button>Notifications</Button>
                   <Button>Share</Button>
                 </ButtonGroup>)
              }
            </ButtonToolbar>
          </div>
        ) :
        '';

      if (this.data.groups.length > 0) {
        var group = this.data.groups[0];
        return (
          <div className="pbl">
            <PageHeader className="group-header">
              {group.name}
              <br />
              <small>
                {TeamzUtils.isGroupOpen(group.privacy) ? 'Open Group' : 'Closed Group'}
              </small>
              {actions}
            </PageHeader>
            {this.renderNavBars()}
          </div>
        );
      } else {
        return (
          <div className='groupHeader'> 
            Count not find group ({this.props.groupId}).
          </div>
        );
      }
    }
  },

  handleSelect(selectedKey) {
    this.setState({
      navKey: selectedKey
    });
  },

  renderNavBars() {
    return (
      <Nav bsStyle='tabs' className="mbl" activeKey={this.state.navKey} onSelect={this.handleSelect}>
        <NavItem eventKey={GROUP_FEED_NAV} title='Group posts'>Posts</NavItem>
        <NavItem eventKey={GROUP_ABOUT_NAV} title='About this group'>About</NavItem>
      </Nav>
    );
  },

  renderTabs() {
    switch (this.state.navKey) {
      case GROUP_ABOUT_NAV:
        return this.renderGroupAbout();
      case GROUP_FEED_NAV:
      default:
        return this.renderGroupFeed();
    }
  },

  renderGroupFeed() {
    return <GroupFeed groupId={this.props.groupId} />
  },

  renderGroupAbout() {
    return <GroupAbout groupId={this.props.groupId} />
  },

  render: function() {
    return (
      <div className="plm">
        {this.renderHeader()}
        {this.renderTabs()}
      </div>
    );
  }
});

module.exports = GroupHome;
