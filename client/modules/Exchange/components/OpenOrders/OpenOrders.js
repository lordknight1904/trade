import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table, Button, Col } from 'react-bootstrap';
import { deleteOrder } from '../../../App/AppActions';
import { getUserName, getOpenOrders, getId, getCoinList, getCoin } from '../../../App/AppReducer';
import { stageInterpreter } from '../../../../util/functions';
import style from '../../../App/App.css';
import { getBuyOrders, getSellOrders } from '../../ExchangeReducer';
import exchangeStyles from '../../pages/Exchange.css';
import numeral from 'numeral';

class OpenOrders extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  onCancel = (order) => {
    const del = {
      orderId: order._id,
      userName: this.props.userName
    };
    this.props.dispatch(deleteOrder(del));
  };
  render(){
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    return (
      <Col md={12} className={`${exchangeStyles.openOrders} ${exchangeStyles.textColor}`}>
        <div className="row" style={{ height: '16px' }}>
          <Col md={3} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
            Volume
          </Col>
          <Col md={3} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
            Price
          </Col>
          <Col md={2} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
            Type
          </Col>
          <Col md={2} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
            Date
          </Col>
          <Col md={2} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
            Cancel
          </Col>
        </div>
        <div className="row">
          <Col md={12}>
            <div className="row">
              <hr style={{ marginBottom: '0', marginTop: '10px' }}/>
            </div>
          </Col>
        </div>
        <div className="row">
          <Col md={12} style={{ backgroundColor: '#1e2b34', overflowY: 'hidden', height: 'calc(100vh - 477px)' }}>
            {
              (this.props.openOrder.length === 0) ? (
                <div className="row" style={{ textAlign: 'center' }}>
                  You have no open order.
                </div>
              ) : ''
            }
            {
              this.props.openOrder.map((o, index) => {
                const date = new Date(o.dateCreated);
                const hours =  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
                const minutes =  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                const time = `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()} ${hours}:${minutes}`;
                return (
                  <div className="row" key={index} >
                    <Col md={3} style={{ color: '#d6d8da' }}>
                      {numeral(o.amountRemain / unit).format('0,0.[000000]')}
                    </Col>
                    <Col md={3} style={{ color: (o.type === 'buy') ? '#7fed63' : '#ff6939' }}>
                      {numeral(o.price).format('0,0.[000000]')}
                    </Col>
                    <Col md={2} style={{ color: (o.type === 'buy') ? '#7fed63' : '#ff6939' }}>
                      {o.type}
                    </Col>
                    <Col md={2} style={{ color: '#d6d8da' }}>
                      {time}
                    </Col>
                    <Col md={2} style={{ color: '#d6d8da', cursor: 'pointer' }} onClick={() => this.onCancel(o)}>
                      Cancel
                    </Col>
                  </div>
                );
              })
            }
          </Col>
        </div>
      </Col>
    );
  }
}

function mapStateToProps(state) {
  return {
    openOrder: getOpenOrders(state),
    coinList: getCoinList(state),
    coin: getCoin(state),
    id: getId(state),
    userName: getUserName(state),
  };
}
OpenOrders.propTypes = {
  dispatch: PropTypes.func,
  openOrder: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
OpenOrders.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OpenOrders);
