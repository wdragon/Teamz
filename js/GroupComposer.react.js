var Parse = require('parse').Parse;
var React = require('react');
var ParseReact = require('parse-react');
var Id = require('parse-react/lib/react-native/Id');

var classNames = require('classnames');

var Input = require('react-bootstrap/lib/Input');
var Button = require('react-bootstrap/lib/Button');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');

var GroupComposer = React.createClass({
  getInitialState: function() {
    return ({
      hasError: false,
      imageData: null,
      uploading: false
    });
  },

  componentDidMount: function() {
    if (this.state.hasError) {
      this.refs.composerText.refs.input.getDOMNode().focus(); 
    }
  },

  renderInput() {
    return this.state.hasError ?
      <Input 
        type='textarea'
        bsStyle='error'
        disabled={this.state.uploading}
        onChange={this._onInputChange}
        ref='composerText' 
        placeholder='What is on your mind?' />
      :
      <Input 
        type='textarea'
        disabled={this.state.uploading}
        onChange={this._onInputChange}
        ref='composerText' 
        placeholder='What is on your mind?' />;
  },

  renderAddImageButton() {
    var imageControl = <input ref="imageControl" onChange={this._imageChosen} type="file" className="hide" />;
    var imageButtonStyle = this.state.imageData ? 'success' : 'primary';
    var imageButtonText = this.state.imageData ? 'Image selected' : 'Select image';
    var imageButton = 
      <Button 
        ref="imageButton" 
        bsStyle={imageButtonStyle} 
        disabled={this.state.uploading}
        onClick={this._chooseImage}>
        {imageButtonText}
      </Button>;
    return (
      <div className="pull-left">
        {imageButton}
        {imageControl}
      </div>
    );
  }, 

  render: function() {
    var loadingClass = classNames(
      "loading_indicator pull-right", 
      {show: this.state.uploading}
    );
    return (
      <div>
        {this.renderInput()}
        <div className="mls">
          <ButtonToolbar>
            {this.renderAddImageButton()}
            <Button 
              bsStyle='primary' 
              className='pull-right'
              disabled={this.state.uploading} 
              onClick={this._submit}>
              Post
            </Button>
            <div className={loadingClass} />
          </ButtonToolbar>
        </div>
      </div>
    );
  },

  _onInputChange() {
    this.setState({hasError: false});
  },

  _chooseImage(e) {
    React.findDOMNode(this.refs.imageControl).click();
    return false;
  },

  _imageChosen(e) {
    // Todo: support multiple images
    this.setState({
      imageData: React.findDOMNode(this.refs.imageControl).files[0]
    });
  },

  _createGroupPost(text, imageUrl) {
    var self = this;
    ParseReact.Mutation.Create('Post', {
      text: text,
      imageUrl: imageUrl
    }).dispatch().then(function (resultPost) {
      var group = new Id('Group', self.props.groupId);
      ParseReact.Mutation.AddRelation(group, 'posts', resultPost).dispatch().then(function(result) {
        self._postSubmit(result);
      });
    });
  },

  _postSubmit(resultPost) {
    if (this.props.addPost) {
      this.props.addPost(resultPost);
    }
    React.findDOMNode(this.refs.composerText.refs.input).value = '';
    this.setState({
      hasError: false,
      imageData: null,
      uploading: false
    });
  },

  _submit() {
    var self = this;
    var text = React.findDOMNode(this.refs.composerText.refs.input).value;
    if (!text && !this.state.imageData) {
      this.setState({hasError: true});
    } else {
      this.setState({uploading: true});
      if (this.state.imageData) {
        var name = this.state.imageData.name;
        var parseFile = new Parse.File(name, this.state.imageData);
        parseFile.save().then(function() {
          self._createGroupPost(text, parseFile.url());
        });
      } else {
        this._createGroupPost(text, null);
      }
    }
  }
});

module.exports = GroupComposer;
