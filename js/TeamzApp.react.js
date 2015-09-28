
var Parse = require('parse').Parse;
var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;
var ParseReact = require('parse-react');

var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var TeamzUtils = require('./TeamzUtils.js');
var GroupDirectory = require('./GroupDirectory.react.js');
var GroupHome = require('./GroupHome.react.js');

var FEED_NAV = 'feed';
var DIRECTORY_NAV = 'directory';
var SETTINGS_NAV = 'settings';

var TeamzApp = React.createClass({

  mixins: [RouterMixin, ParseReact.Mixin],

  routes: {
    '/': 'renderInternal',
  },

  observe: function(props, state) {
    var params = TeamzUtils.getURLParams(state.path);  
    if (params.gid) {
      return {
        group: new Parse.Query('Group').equalTo('objectId', params.gid)
      };
    } else {
      delete this.data.group;
    }
    return {};
  },

  renderInternal(params) {
    return (
      <Grid>
        <Row>
          <Col md={2} className="left-border-1">{this.renderNav(params)}</Col>
          <Col md={10} className="left-border-1">{this.renderBody(params)}</Col>
        </Row>
      </Grid>
    );
  },

  renderBody(params) {
    if ('gid' in params) {
      return this.renderGroup(params.gid, params);
    }
    return this.renderSelectedTab(params.k);
  },

  renderSelectedTab(selectedKey) {
    switch (selectedKey) {
      case DIRECTORY_NAV:
        return this.renderDirectory();
      case SETTINGS_NAV:
        return this.renderSettings();
      case FEED_NAV:
      default:
        return this.renderFeed();
    }
  },

  renderPageHeader() {
    return (
      <div className="page-header">
        <h1>teamz <small>your teams, together</small></h1>
      </div>
    );
  },

  renderNav(params) {
    var key = FEED_NAV;
    if ('gid' in params) {
      key = params.gid;
    } else if ('k' in params) {
      key = params.k;
    }

    var groupNavs;
    if (this.data.group && this.data.group.length) {
      var gid = this.data.group[0].objectId; 
      var gname = this.data.group[0].name;
      groupNavs = (
        <NavItem eventKey={gid} href={TeamzUtils.getGroupURL(gid)} title={gname}>{gname}</NavItem>
      );
    }

    return (
      <Nav bsStyle='pills' stacked activeKey={key}>
        <NavItem eventKey={FEED_NAV} href={TeamzUtils.getNavURL(FEED_NAV)} title='Feed'>Feed</NavItem>
        <NavItem eventKey={DIRECTORY_NAV} href={TeamzUtils.getNavURL(DIRECTORY_NAV)} title='Find all groups'>Directory</NavItem>
        <NavItem eventKey={SETTINGS_NAV} href={TeamzUtils.getNavURL(SETTINGS_NAV)} title='Configure your account'>Settings</NavItem>
        {groupNavs ? <hr /> : ''}
        {groupNavs}
      </Nav>
    );
  },

  renderFeed() {
    // Need to define feed
    return null; 
  },

  renderDirectory() {
    return (
      <GroupDirectory />
    ); 
  },

  renderSettings() {
    return (
      <div>To be built</div>
    ); 
  },

  renderGroup(gid, params) {
    return (
      <GroupHome groupId={gid} />
    );
  },

  render: function() {
    return (
      <div>
        {this.renderPageHeader()}
        {this.renderCurrentRoute()}
      </div>
    );
  },

  notFound: function(path) {
    return <div className="not-found">Page Not Found: {path}</div>;
  }

});

module.exports = TeamzApp;
