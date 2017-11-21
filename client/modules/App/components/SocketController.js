import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setSocket, getHold, getMyOrders, getBalance, getTransaction } from '../AppActions';
import { getId, getUserName, getSocket, getCoin } from '../AppReducer';
import { getSellOrder, getBuyOrder } from '../../Exchange/ExchangeActions';
import ChatSocket from '../../../util/ChatSocket';

export class SocketController extends Component {
  componentDidMount() {
    Promise.resolve(this.props.dispatch(setSocket(new ChatSocket()))).then(() => {
      this.isDidMount = true;
      console.log(this.props.socketIO);
      this.props.socketIO.listening((message) => {
        console.log(message);
        switch (message.code) {
          case 'updateOrderList': {
            if (this.props.coin === message.coin) {
              this.props.dispatch(getSellOrder(this.props.coin));
              this.props.dispatch(getBuyOrder(this.props.coin));
            }
            break;
          }
          case 'ordersAndHold': {
            this.props.dispatch(getBalance(this.props.userName, 'BTC'));
            this.props.dispatch(getBalance(this.props.userName, 'USDT'));
            this.props.dispatch(getHold(this.props.userName, message.coin));
            if (this.props.coin === message.coin) {
              this.props.dispatch(getSellOrder(this.props.coin));
              this.props.dispatch(getBuyOrder(this.props.coin));
              this.props.dispatch(getMyOrders(this.props.userName, message.coin));
              this.props.dispatch(getTransaction(this.props.userName, message.coin));
            }
            break;
          }
          case 'ordersIndividualAndHold': {
            if (this.props.coin === message.coin) {
              this.props.dispatch(getSellOrder(this.props.coin));
              this.props.dispatch(getBuyOrder(this.props.coin));
              this.props.dispatch(getHold(this.props.userName, message.coin));
              this.props.dispatch(getMyOrders(this.props.userName, message.coin));
              this.props.dispatch(getTransaction(this.props.userName, message.coin));
            }
            break;
          }
          default: {
            break;
          }
        }
      });
    });
  }
  componentWillReceiveProps(props) {
    if (this.isDidMount === false) {
      return;
    }
    let userId = (props.id === '') ? 'guest' : props.id;
    if (userId !== this.previousUserLoginID) {
      this.connectToServer(props, userId);
    }
  }

  connectToServer(props, userId) {
    props.socketIO.doConnect({ id: userId });
    props.dispatch(setSocket(props.socketIO));
    this.previousUserLoginID = userId;
  }

  handleLogout(props) {
    props.socketIO.disconnect();
    props.dispatch(setSocket(props.socketIO));
  }
  render() {
    return null;
  }
}
SocketController.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socketIO: PropTypes.object.isRequired,
  coin: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    userName: getUserName(state),
    socketIO: getSocket(state),
    coin: getCoin(state),
  };
}

export default connect(mapStateToProps)(SocketController);
