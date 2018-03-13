import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, MenuItem, NavDropdown, Col, Image, Glyphicon, Badge } from 'react-bootstrap'
import styles from './Header.css';
import { onSignIn, onSignUp, logout, changeCoin, addOpen, getMyOrders } from '../../AppActions';
import { getSignIn, getSignUp, getUserName, getId, getCoin } from '../../AppReducer';
import { getBuyOrder, getSellOrder, addBuyOrders, addSellOrders } from '../../../Exchange/ExchangeActions';

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
      case 'history': {
        if (this.props.id === '' ) {
          this.props.dispatch(onSignIn());
        } else {
          this.context.router.push('/history');
        }
        break;
      }
      default: break;
    }
    this.timer1 = {};
    this.timer2 = {};
  };
  onClick = () => {
    this.context.router.push('/');
  };
  handleCoin = (eventKey) => {
    this.props.dispatch(changeCoin(eventKey));
    this.props.dispatch(addBuyOrders([]));
    this.props.dispatch(addSellOrders([]));
    if (this.props.id !== '') {
      this.props.dispatch(addOpen([]));
      this.timer1 = setTimeout(() => {
        this.props.dispatch(getMyOrders(this.props.userName, eventKey));
      }, 1000);
    }
    this.timer2 = setTimeout(() => {
      this.props.dispatch(getBuyOrder(eventKey));
      this.props.dispatch(getSellOrder(eventKey));
    }, 1000);
  };
  componentWillUnmount() {
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
  }

  chuyenPage = () => {
    window.open('http://125.212.253.77:9000', '_blank');
  };
  render() {
    return (
      <Navbar inverse collapseOnSelect className={styles.headerstyle}>
        <Navbar.Header>
          <Navbar.Brand>
            <a onClick={this.onClick} style={{ padding: '0' }}>
              <img role="presentation" style={{ height: '50px' }} src="/logo/logo.svg" />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav className={styles.noneBlue} onSelect={this.handleCoin}>
            <NavDropdown title={this.props.coin} id="basic-nav-dropdown">
              <MenuItem eventKey="BTC"><Glyphicon glyph="glyphicon glyphicon-btc" />   BTC</MenuItem>
              {/*<MenuItem eventKey="DASH"><Glyphicon glyph="cf-dash" />   DASH</MenuItem>*/}
              <MenuItem eventKey="ETH"><Glyphicon glyph="glyphicon glyphicon-credit-card" />   ETH</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight onSelect={this.chuyenPage}>
            <NavItem>Hotcoin Market</NavItem>
          </Nav>
          {
            (this.props.userName === '') ? (
              <Nav className={styles.noneBlue} pullRight onSelect={this.handleAuth}>
                <NavItem eventKey="signIn">Sign In</NavItem>
                <NavItem eventKey="signUp">Sign Up</NavItem>
              </Nav>
            ) : (
              <Nav className={styles.noneBlue} pullRight onSelect={this.handleUser}>
                <NavDropdown title={this.props.userName} id="basic-nav-dropdown">
                  <MenuItem eventKey="profile"><Glyphicon glyph="glyphicon glyphicon-hdd" />  Profile</MenuItem>
                  <MenuItem eventKey="wallet"><Glyphicon glyph="glyphicon glyphicon-credit-card" />  Wallets</MenuItem>
                  <MenuItem eventKey="history"><Glyphicon glyph="glyphicon glyphicon-list" />  History</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="logOut"><Glyphicon glyph="glyphicon glyphicon-log-out" /> Sign Out</MenuItem>
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
    coin: getCoin(state),
    id: getId(state),
  };
}
Header.propTypes = {
  dispatch: PropTypes.func,
  isSignIn: PropTypes.bool.isRequired,
  isSignUp: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
Header.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Header);
