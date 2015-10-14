var Parse = require('parse').Parse;
var React = require('react');
var ParseReact = require('parse-react');

var Alert = require('react-bootstrap/lib/Alert');

var GroupPost = require('./GroupPost.react.js');
var GroupComposer = require('./GroupComposer.react.js');
var LoadMore = require('./LoadMore.react.js');

const FEED_PAGE_SIZE = 15;

var GroupFeed = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState: function() {
    return ({
      offset: 0,
      fetch: true,
      posts: null,
      seeMore: false,
    });
  },

  observe: function(props, state) {
   var group = new Parse.Object('Group');
    group.id = props.groupId;
    return {
      posts: group.relation('posts').query().descending('createdAt').skip(state.offset).limit(20)
    };
  },

  onSeeMoreClick(e) {
    var posts = this.state.posts || [];
    var offset = this.state.offset;
    this.setState({
      offset: offset + FEED_PAGE_SIZE,
      posts: posts.concat(this.data.posts),
      seeMore: this.data.posts.length >= FEED_PAGE_SIZE,
    });
    delete this.data.posts;
  },

  renderSeeMore() {
    var hasEnoughPosts = this.data.posts && this.data.posts.length >= FEED_PAGE_SIZE; 
    if (this.state.seeMore || hasEnoughPosts) {
      var loading = this.pendingQueries().indexOf('posts') != -1;
      return (
        <div className="mtl mbl">
          <LoadMore isLoading={loading} onClick={this.onSeeMoreClick}/>
        </div>
      );
    }
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

  render: function() {
    var composer = (
      <div>
        <GroupComposer groupId={this.props.groupId} addPost={this.addPost} />
        <hr />
      </div>
    ); 
    return (
      <div className={this.pendingQueries().length ? 'group_post_list loading' : 'group_post_list'}>
        {composer}
        {this.state.posts? 
          this.state.posts.map(function(p) {
            return (
              <GroupPost key={p.id} post={p} />
            );
          }) : ''
        }
        {this.data.posts ?
          this.data.posts.map(function(p) {
            return (
              <GroupPost key={p.id} post={p} />
            );
          }) : ''
        }
        {this.renderSeeMore()}
        {this.renderError()}
      </div>
    );
  },

  addPost: function(newPost) {
    this.setState({offset: 0, posts: null});
    this.refreshQueries('posts');
  }
});

module.exports = GroupFeed;
