import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Button, Form, FormGroup, Col, FormControl, ControlLabel, HelpBlock, InputGroup } from 'react-bootstrap';
import { onSignIn, onSignUp, onCloseSign, loginRequest, login, getBalance, getMyOrders, fetchTransaction, googleFactor } from '../../AppActions';
import { getSignIn, getCoin, getGoogleAuthentication } from '../../AppReducer';

class SignInDialog extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',

      emailError: '',
      passwordError: '',

      isLoggingIn: false,
      isGoogle: false,
      googleCode: '',
      id: '',
      isGoogling: false,
    };
  }
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  onHide = () => {
    this.props.dispatch(onCloseSign());
  };
  onSigningIn = () => {
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    this.setState({ isLoggingIn: true });
    this.props.dispatch(loginRequest(user)).then((res) => {
      this.setState({ isLoggingIn: false });
      if (res.user  === 'login fail') {
        this.setState({ error: 'Không thể đăng nhập.' });
        return;
      }
      if (res.user  === 'googleAuth') {
        this.setState({ isGoogle: true, id: res.id });
        return;
      }
      this.setState({error: ''});
      this.props.dispatch(getMyOrders(res.user.userName, this.props.coin));
      this.props.dispatch(fetchTransaction(res.user.userName, this.props.coin, 0));
      this.props.dispatch(getBalance(res.user.userName, 'BTC'));
      this.props.dispatch(getBalance(res.user.userName, 'USDT'));
      this.props.dispatch(getBalance(res.user.userName, 'ETH'));
      this.props.dispatch(login(res.user));
      this.props.dispatch(onCloseSign());
    });
  };

  handleEmail = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ email: event.target.value.trim(), emailError: 'Trường này không được trống.' });
    } else {
      if (this.validateEmail(event.target.value.trim())) {
        this.setState({ email: event.target.value.trim(), emailError: ''});
      } else {
        this.setState({ email: event.target.value.trim(), emailError: 'Email không đúng định dạng.' });
      }
    }
  };
  handlePassword = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ password: event.target.value.trim(), passwordError: 'Trường này không được trống.' });
    } else {
      this.setState({ password: event.target.value.trim(), passwordError: '' });
    }
  };
  handleEmailBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ emailError: 'Trường này không được trống.'});
    } else {
      if (this.validateEmail(event.target.value.trim())) {
        this.setState({ emailError: ''});
      } else {
        this.setState({ emailError: 'Email không đúng định dạng.'});
      }
    }
  };
  handlePasswordBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ passwordError: 'Trườg này không được trống.'});
    } else {
      this.setState({ passwordError: ''});
    }
  };
  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.onSigningIn();
    }
  };

  handleGoogleCode = (event) => { this.setState({ googleCode: event.target.value.trim() }); };
  onGoogleKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.onGoogleFactor();
    }
  };
  onGoogleFactor = () => {
    const user = {
      id: this.state.id,
      googleCode: this.state.googleCode,
    };
    this.setState({ isGoogling: true });
    this.props.dispatch(googleFactor(user)).then((res) => {
      this.setState({ isGoogling: false, googleCode: '' });
      if (res.user === 'error') {
        this.setState({ error: 'Sign in error.' });
        return;
      }
      if (res.user === 'missing') {
        this.setState({ error: 'Please provide information adequately.' });
        return;
      }
      if (res.user === 'reject') {
        this.setState({ error: 'Incorrect Google security code.' });
        return;
      }
      if (res.user === 'not found') {
        this.setState({ error: 'Do not found this account.' });
        return;
      }
      this.props.dispatch(login(res.user));
      this.props.dispatch(onCloseSign());
      this.setState({ isGoogle: false, error: '' });
    });
  };
  render(){
    return (
      <Modal show={this.props.isSignIn}>
        <Modal.Header style={{ backgroundColor: 'rgb(10, 105, 112)' }}>
          <Modal.Title style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="formHorizontalEmail" validationState={(this.state.emailError !== '') ? 'error' : null}>
              <Col sm={3} componentClass={ControlLabel}>Email</Col>
              <Col sm={9}>
                <FormControl
                  type="email"
                  value={this.state.email}
                  onChange={this.handleEmail}
                  onBlur={this.handleEmailBlur}
                  onKeyDown={this.onKeyDown}
                  disabled={this.state.isGoogle || this.state.isLoggingIn}
                />
                <HelpBlock>{this.state.emailError}</HelpBlock>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword" validationState={(this.state.passwordError !== '') ? 'error' : null}>
              <Col sm={3} componentClass={ControlLabel}>Password</Col>
              <Col sm={9}>
                <FormControl
                  type="password"
                  value={this.state.password}
                  onChange={this.handlePassword}
                  onBlur={this.handlePasswordBlur}
                  onKeyDown={this.onKeyDown}
                  disabled={this.state.isGoogle || this.state.isLoggingIn}
                />
                <HelpBlock>{this.state.passwordError}</HelpBlock>
              </Col>
            </FormGroup>
            {
              this.state.isGoogle ? (
                <FormGroup controlId="formHorizontalPassword" validationState={(this.state.passwordError !== '') ? 'error' : null}>
                  <Col sm={3} componentClass={ControlLabel}>Google Security Code</Col>
                  <Col sm={9}>
                    <InputGroup>
                      <FormControl
                        type="text"
                        value={this.state.googleCode}
                        onChange={this.handleGoogleCode}
                        onKeyDown={this.onGoogleKeyDown}
                      />
                      <InputGroup.Button>
                        <Button onClick={this.onGoogleFactor} disabled={this.state.isGoogling}>Verify</Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </Col>
                </FormGroup>
                ) : ''
            }
            {
              (this.state.error !== '') ? (
                <FormGroup controlId="error" validationState='error' >
                  <Col sm={6} smOffset={3} >
                    <HelpBlock>{this.state.error}</HelpBlock>
                  </Col>
                </FormGroup>
              ) : ''
            }
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'rgb(10, 105, 112)', textAlign: 'center' }}>
          <Button onClick={this.onSigningIn} bsStyle="success" disabled={this.state.isLoggingIn || this.state.isGoogle}>Submit</Button>
          <Button onClick={this.onHide} bsStyle="danger" disabled={this.state.isLoggingIn || this.state.isGoogle}>Exit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


function mapStateToProps(state) {
  return {
    isSignIn: getSignIn(state),
    coin: getCoin(state),
    googleAuthentication: getGoogleAuthentication(state),
  };
}
SignInDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  coin: PropTypes.string.isRequired,
};
SignInDialog.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(SignInDialog);
