import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import SignInDialog from './components/Auth/SignInDialog';
import SignUpDialog from './components/Auth/SignUpDialog';
import TransactionDetail from './components/TransactionDetail/TransactionDetail';

import { closeNotify, fetchSettings } from './AppActions';
import { getIsNotify, getMessage, getCoin, getGoogleAuthentication, getGoogleSecret } from './AppReducer';
import { Modal, Row } from 'react-bootstrap';

import { getBuyOrder, getSellOrder } from '../Exchange/ExchangeActions';
import SocketController from './components/SocketController';
import QRCode from 'qrcode';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false, isGoogle: false, user: {}, qrcode: '', token: '' };
    this.muiThemeSetting = getMuiTheme(null, { userAgent: 'all' });
  }
  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
    this.props.dispatch(getBuyOrder(this.props.coin));
    this.props.dispatch(getSellOrder(this.props.coin));
    this.props.dispatch(fetchSettings());
  }
  onHide = () => {
    this.props.dispatch(closeNotify());
  };
  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiThemeSetting}>
        <div>
          {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
          <div>
            <Helmet
              title="Hotcoinex"
              titleTemplate=""
              meta={[
                { charset: 'utf-8' },
                {
                  'http-equiv': 'X-UA-Compatible',
                  content: 'IE=edge',
                },
                {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1',
                },
              ]}
            />
            <SocketController />
            <Header />

            <div style={{ paddingTop: '50px' }}>
              {this.props.children}
            </div>
            {/*<Footer />*/}

            <SignInDialog />
            <SignUpDialog />

            <Modal show={this.props.isNotify} onHide={this.onHide}>
              <Modal.Header closeButton>
                <Modal.Title>Alert</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.props.message}
              </Modal.Body>
            </Modal>

            <TransactionDetail />

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  coin: PropTypes.string.isRequired,
  isNotify: PropTypes.bool.isRequired,
  googleAuthentication: PropTypes.bool.isRequired,
  googleSecret: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    isNotify: getIsNotify(store),
    message: getMessage(store),
    coin: getCoin(store),
    googleAuthentication: getGoogleAuthentication(store),
    googleSecret: getGoogleSecret(store),
  };
}

export default connect(mapStateToProps)(App);
