import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, MenuItem, NavDropdown, Col, Image, Glyphicon, Badge } from 'react-bootstrap'
import styles from './Header.css';
import { onSignIn, onSignUp, logout } from '../../AppActions';
import { getSignIn, getSignUp, getUserName, getId } from '../../AppReducer';

class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: 'en',
      open: false,
      openUserMenu: false,
      dataSource: [],
    };
  }
  handleAuth = (selectedKey) => {
    switch (selectedKey) {
      case 'signUp': {
        this.props.dispatch(onSignUp());
        break;
      }
      case 'signIn': {
        this.props.dispatch(onSignIn());
        break;
      }
      default: break;
    }
  };
  handleUser = (selectedKey) => {
    switch (selectedKey) {
      case 'logOut': {
        this.context.router.push('/');
        this.props.dispatch(logout());
        break;
      }
      case 'profile': {
        if (this.props.id === '' ) {
          this.props.dispatch(onSignIn());
        } else {
          this.context.router.push('/profile');
        }
        break;
      }
      case 'wallet': {
        if (this.props.id === '' ) {
          this.props.dispatch(onSignIn());
        } else {
          this.context.router.push(`/wallet/${this.props.id}`);
        }
        break;
      }
      default: break;
    }
  };
  onClick = () => {
    this.context.router.push('/');
  };
  onTrade = () => {
    this.context.router.push('/exchange');
  };
  render() {
    return (
      <Navbar inverse collapseOnSelect className={styles.headerstyle}>
        <Navbar.Header>
          <Navbar.Brand>
            <a onClick={this.onClick}>Diginex</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem onClick={this.onTrade}>Giao dịch</NavItem>
          </Nav>
          {
            (this.props.userName === '') ? (
              <Nav className={styles.noneBlue} pullRight onSelect={this.handleAuth}>
                <NavItem eventKey="signIn">Đăng nhập</NavItem>
                <NavItem eventKey="signUp">Đăng ký</NavItem>
              </Nav>
            ) : (
              <Nav className={styles.noneBlue} pullRight onSelect={this.handleUser}>
                <NavDropdown title={this.props.userName} id="basic-nav-dropdown">
                  <MenuItem eventKey="profile">Hồ sơ</MenuItem>
                  <MenuItem eventKey="wallet">Ví điện tử</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="logOut">Đăng xuất</MenuItem>
                </NavDropdown>
              </Nav>
            )
          }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSignIn: getSignIn(state),
    isSignUp: getSignUp(state),
    userName: getUserName(state),
    id: getId(state),
  };
}
Header.propTypes = {
  dispatch: PropTypes.func,
  isSignIn: PropTypes.bool.isRequired,
  isSignUp: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
Header.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Header);
