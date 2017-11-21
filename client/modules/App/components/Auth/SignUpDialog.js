import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Button, Form, FormGroup, Col, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { onCloseSign, createUser, setNotify } from '../../AppActions';
import { getSignUp } from '../../AppReducer';

class SignUpDialog extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      userName: '',
      password: '',

      emailError: '',
      userNameError: '',
      passwordError: '',

      isSigningUp: false,
    };
  }
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  onHide = () => {
    this.props.dispatch(onCloseSign());
  };
  onSigningUp = () => {
    if (
      this.state.email !== '' &&
      this.state.userName !== '' &&
      this.state.password !== '' &&
      this.state.emailError === '' &&
      this.state.userNameError === '' &&
      this.state.passwordError === ''
    ) {
      const user = {
        email: this.state.email,
        userName: this.state.userName,
        password: this.state.password,
      };
      this.setState({ isSigningUp: true });
      this.props.dispatch(createUser(user)).then((res) => {
        this.setState({ isSigningUp: false });
        this.props.dispatch(onCloseSign());
        if (res.user.code === 'success') {
          this.props.dispatch(setNotify('Đăng ký thành công \n Vui lòng kiềm tra email để kích hoạt tài khoản.'));
        } else {
          this.props.dispatch(setNotify(res.user.code));
        }
      });
    } else {
      if (this.state.email === '') {
        this.setState({ emailError: 'Xin vui lòng nhập Email.' });
      }
      if (this.state.userName === '') {
        this.setState({ userNameError: 'Xin vui lòng nhập tên tài khoản.' });
      }
      if (this.state.password === '') {
        this.setState({ passwordError: 'Xin vui lòng nhập mật khẩu.' });
      }
    };
  };
  handleEmail = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({email: event.target.value.trim(), emailError: 'Trườg này không được trống.'});
    } else {
      if (this.validateEmail(event.target.value.trim())) {
        this.setState({email: event.target.value.trim(), emailError: ''});
      } else {
        this.setState({email: event.target.value.trim(), emailError: 'Email không đúng định dạng.'});
      }
    }
  };
  handleUserName = (event) => {
    this.setState({ userName: event.target.value });
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
      this.setState({ emailError: 'Trườg này không được trống.'});
    } else {
      if (this.validateEmail(event.target.value.trim())) {
        this.setState({ emailError: ''});
      } else {
        this.setState({ emailError: 'Email không đúng định dạng.'});
      }
    }
  };
  handleUserNameBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ userNameError: 'Trườg này không được trống.'});
    } else {
      this.setState({ userNameError: ''});
    }
  };
  handlePasswordBlur = (event) => {
    if (event.target.value.trim() === '') {
      this.setState({ passwordError: 'Trườg này không được trống.'});
    } else {
      this.setState({ passwordError: ''});
    }
  };
  render(){
    return (
      <Modal show={this.props.isSignUp}>
        <Modal.Header>
          <Modal.Title>Đăng ký</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="formHorizontalEmail" validationState={(this.state.emailError !== '') ? 'error' : null}>
              <Col sm={3} componentClass={ControlLabel}>Email</Col>
              <Col sm={9}>
                <FormControl type="email" value={this.state.email} onChange={this.handleEmail} onBlur={this.handleEmailBlur} />
                <HelpBlock>{this.state.emailError}</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalUserName" validationState={(this.state.userNameError !== '') ? 'error' : null}>
              <Col sm={3} componentClass={ControlLabel}>Tên tài khoản</Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.userName} onChange={this.handleUserName} onBlur={this.handleUserNameBlur} />
                <HelpBlock>{this.state.userNameError}</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalPassword" validationState={(this.state.passwordError !== '') ? 'error' : null}>
              <Col sm={3} componentClass={ControlLabel}>Mật khẩu</Col>
              <Col sm={9}>
                <FormControl type="password" value={this.state.password} onChange={this.handlePassword} onBlur={this.handlePasswordBlur} />
                <HelpBlock>{this.state.passwordError}</HelpBlock>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSigningUp} disabled={this.state.isSigningUp}>
            {(this.state.isSigningUp) ? 'Đang gửi yêu cầu' : 'Đăng ký'}
          </Button>
          <Button onClick={this.onHide} disabled={this.state.isSigningUp}>
            {(this.state.isSigningUp) ? 'Đang gửi yêu cầu' : 'Thoát'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


function mapStateToProps(state) {
  return {
    isSignUp: getSignUp(state),
  };
}
SignUpDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
SignUpDialog.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(SignUpDialog);
