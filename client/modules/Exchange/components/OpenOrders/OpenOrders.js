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
        <div className="row">
          <Col md={12} className={`${exchangeStyles.panelHeader}`}>
            <div className={`${exchangeStyles.panelHeaderTitle}`}>
              OPEN ORDERS
            </div>
          </Col>
        </div>
        <div className={`row ${exchangeStyles.panelHeader2}`}>
          <Col md={1} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'right' }}>
            Size
          </Col>
          <Col md={2} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'center' }}>
            {`Filled (${this.props.coin})`}
          </Col>
          <Col md={2} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'right' }}>
            Price (USDT)
          </Col>
          <Col md={2} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'right' }}>
            Network Fee
          </Col>
          <Col md={2} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'right' }}>
            Fee USDT
          </Col>
          <Col md={1} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'right' }}>
            Time
          </Col>
          <Col md={2} className={exchangeStyles.panelHeaderTitle3} style={{ textAlign: 'center' }}>
            Status
          </Col>
        </div>
        <div className="row">
          <Col md={12}>
            <div className="row">
              <hr style={{ marginBottom: '0', marginTop: '0', borderTop: '1px solid #222f38' }}/>
            </div>
          </Col>
        </div>
        <div className="row">
          <Col md={12} style={{ backgroundColor: '#1e2b34', overflowY: 'hidden', height: 'calc(100vh - 511px)' }}>
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
                let fee = 0;
                let feeUsdt = 0;
                o.transactions.map((t) => {
                  fee += t.feeCoin;
                  feeUsdt += t.feeUsdt;
                });
                return (
                  <div className="row" key={index} >
                    <Col md={1} style={{ color: '#d6d8da', textAlign: 'right' }}>
                      {numeral(o.amount / unit).format('0,0.[000000]')}
                    </Col>
                    <Col md={1} style={{ color: '#d6d8da', textAlign: 'center' }}>
                      {numeral((o.amount - o.amountRemain) / unit).format('0,0.[000000]')}
                    </Col>
                    <Col md={2} style={{ color: (o.type === 'buy') ? '#7fed63' : '#ff6939', textAlign: 'right' }}>
                      {numeral(o.price).format('0,0.[000000]')}
                    </Col>
                    <Col md={2} style={{ color: '#d6d8da', textAlign: 'right' }}>
                      {numeral(fee).format('0,0.[000000]')}
                    </Col>
                    <Col md={2} style={{ color: '#d6d8da', textAlign: 'right' }}>
                      {numeral(feeUsdt).format('0,0.[000000]')}
                    </Col>
                    <Col md={2} style={{ color: '#d6d8da', textAlign: 'right' }}>
                      {time}
                    </Col>
                    <Col md={2} style={{ color: '#d6d8da', cursor: 'pointer', textAlign: 'center' }} onClick={() => this.onCancel(o)}>
                      Open(Cancel)
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
