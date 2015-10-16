var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

var PrettyDate = require('./PrettyDate.react.js');
var Thumbnail = require('react-bootstrap/lib/Thumbnail');
var Button = require('react-bootstrap/lib/Button');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var Input = require('react-bootstrap/lib/Input');

var GroupPostFeedback = require('./GroupPostFeedback.react.js');
var TeamzUtils = require('./TeamzUtils.js');

var GroupPost = React.createClass({

  render: function() {
    var image = '';
    if (this.props.post.imageUrl) {
      image = <Thumbnail src={this.props.post.imageUrl} />;
    }

    return (
      <div className="group_post">
        <div className="clearfix">
          <div className='pull-left prm'>
            <Thumbnail 
              className='profile_image' 
              src={TeamzUtils.getUserProfileUrl(this.props.post.creator)} 
              alt='' />
          </div>
          <div>
            <div className="pts pbs">
              {TeamzUtils.getUserName(this.props.post.creator)}
            </div>
            <div className="group_post_date">
              <PrettyDate value={this.props.post.createdAt} />
            </div>
          </div>
        </div>
        <div className="group_post_text pts pbs">
          {this.props.post.text}
        </div>
        {image}
        <GroupPostFeedback postId={this.props.post.id} />
      </div>
    );
  }
});

module.exports = GroupPost;
