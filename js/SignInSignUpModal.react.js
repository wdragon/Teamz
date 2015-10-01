var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');

var Modal = require('react-bootstrap/lib/Modal');
var Input = require('react-bootstrap/lib/Input');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Button = require('react-bootstrap/lib/Button');
var Alert = require('react-bootstrap/lib/Alert');

var SignInSignUpModal = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState: function() {
    return ({
      error: null,
    });
  },

  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },

  render: function() {
    if (this.data.user) {
      return <span />;
    } else {
      return (
        <Modal 
          title='Sign In or Sign Up' 
          animation={true}
          onRequestHide={function() {}}
          >
          <div className='modal-body'>
            <form className='form-horizontal'>
              {
                this.state.error ?
                <Alert bsStyle='danger'>{this.state.error}</Alert> :
                ''
              }
              <Input 
                type='text' 
                label='Username' 
                ref='username'
                labelClassName='col-xs-2' 
                wrapperClassName='col-xs-10'/>
              <Input 
                type='password' 
                label='Password'
                ref='password'
                labelClassName='col-xs-2' 
                wrapperClassName='col-xs-10'
                placeholder={'Minimum 6 characters'} />
              <ButtonToolbar>
                <Button onClick={this._onSignIn} bsStyle='primary'>Sign In</Button>
                <Button onClick={this._onSignUp}>Sign Up</Button>
              </ButtonToolbar>
            </form>
          </div>
        </Modal>
      );
    }  
  },

  _onSignIn: function() {
    var self = this;
    var username = React.findDOMNode(this.refs.username.refs.input).value;
    var password = React.findDOMNode(this.refs.password.refs.input).value;
    if (username.length && password.length) {
      Parse.User.logIn(username, password).then(function() {
        self.setState({
          error: null
        });
      }, function() {
        self.setState({
          error: 'Incorrect username or password'
        });
      });
    } else {
      this.setState({
        error: 'Please enter all fields'
      });
    }
  },

  _onSignUp: function() {
    var self = this;
    var username = React.findDOMNode(this.refs.username.refs.input).value;
    var password = React.findDOMNode(this.refs.password.refs.input).value;
    if (username.length && password.length) {
      var u = new Parse.User({
        username: username,
        password: password
      });
      u.signUp().then(function() {
        self.setState({
          error: null
        });
      }, function() {
        self.setState({
          error: 'Invalid account information'
        });
      });
    } else {
      this.setState({
        error: 'Please enter all fields'
      });
    }
  }
});

module.exports = SignInSignUpModal;
