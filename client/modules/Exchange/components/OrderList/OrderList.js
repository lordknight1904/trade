import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table, Button, Col } from 'react-bootstrap';
import { deleteOrder, setNotify } from '../../../App/AppActions';
import { getSignIn, getSignUp, getUserName, getId, getCoinList, getCoin } from '../../../App/AppReducer';
import { stageInterpreter } from '../../../../util/functions';
import style from '../../../App/App.css';
import { getBuyOrders, getSellOrders, getRate } from '../../ExchangeReducer';
import { fetchRate } from '../../ExchangeActions';
import exchangeStyles from '../../pages/Exchange.css';
import numeral from 'numeral';

class OrderList extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.props.dispatch(fetchRate(this.props.coin));
  }
  render(){
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    const rate = this.props.rate[this.props.coin];
    let my = 0;
    if (rate && rate.hasOwnProperty('transactions')) {
      rate.transactions.map(t => {
        if (t.from.toString() === this.props.id || t.to.toString() === this.props.id) {
          my += t.amount;
        }
      });
    }
    return (
      <div className={`row ${exchangeStyles.main} ${exchangeStyles.textColor} ${exchangeStyles.orderListBorder}`}>
        <Col md={12} className={`${exchangeStyles.panelHeader}`}>
          <div className={`${exchangeStyles.panelHeaderTitle}`}>
            ORDER BOOK
          </div>
        </Col>
        <hr/>
        <Col md={12} style={{ height: 'calc(100vh - 109px)'}}>
          <div className={`row ${exchangeStyles.panelHeader2}`} >
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'right' }} md={2} >
              Ask
            </Col>
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'right' }} md={4} >
              Market Size
            </Col>
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'right' }} md={3} >
              Price
            </Col>
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'center' }} md={3} >
              My size
            </Col>
          </div>
          <div className="row" style={{ height: 'calc(50% - 40px)' }}>
            <Col md={12}
                 style={{
                   backgroundColor: '#1e2b34',
                   height: '100%',
                   overflowY: 'hidden',
                   display: 'flex',
                   flexDirection: 'column-reverse'
                 }}
            >
              {
                this.props.sellOrders.map((o, index) => {
                  let placeSum = 0;
                  o.userId.map((u) => {
                    if (u.userId === this.props.id) {
                      placeSum += u.amountRemain;
                    }
                  });
                  return (
                    <div className={`row ${exchangeStyles.orderRow}`} key={index} onClick={() => this.props.onOrderClick(o)} style={{ cursor: 'pointer' }} >
                      <Col md={2} style={{ color: '#d6d8da', textAlign: 'right' }}>
                      </Col>
                      <Col md={4} style={{ color: '#d6d8da', textAlign: 'right' }}>
                        {numeral(o.amountRemain / unit).format('0,0.[000000]')}
                      </Col>
                      <Col md={3} style={{ color: '#ff6939', textAlign: 'right' }}>
                        {numeral(o.price).format('0,0.[000000]')}
                      </Col>
                      <Col md={3} style={{ color: '#d6d8da', textAlign: 'center' }}>
                        {(this.props.id !== '') ? numeral(placeSum / unit).format('0,0.[000000]') : '-'}
                      </Col>
                    </div>
                  )
                })
              }
            </Col>
          </div>
          <div className={`row`}>
            <Col md={3} style={{ color: '#d6d8da', textAlign: 'right' }}>
              Matched
            </Col>
            <Col md={3} style={{ color: '#d6d8da', textAlign: 'right' }}>
              {(rate && rate.hasOwnProperty('volume')) ? numeral(rate.volume/unit).value() : '~'}
            </Col>
            <Col md={3} style={{ color: '#d6d8da', textAlign: 'right' }}>
              {(rate && rate.hasOwnProperty('price')) ? numeral(rate.price).format('0,0.[000000]') : '~'}
            </Col>
            <Col md={3} style={{ color: '#d6d8da', textAlign: 'right' }}>
              {numeral(my.volume/unit).value()}
            </Col>
          </div>
          <div className="row" style={{ height: 'calc(50% - 40px)'}}>
            <Col md={12} style={{ backgroundColor: '#1e2b34', height: '100%', overflowY: 'hidden' }} >
              {
                this.props.buyOrders.map((o, index) => {
                  let placeSum = 0;
                  o.userId.map((u) => {
                    if (u.userId === this.props.id) {
                      placeSum += u.amountRemain;
                    }
                  });
                  return (
                    <div className={`row ${exchangeStyles.orderRow}`} key={index} onClick={() => this.props.onOrderClick(o)}>
                      <Col md={2} style={{ color: '#d6d8da', textAlign: 'right' }}>
                      </Col>
                      <Col md={4} style={{ color: '#d6d8da', textAlign: 'right' }}>
                        {numeral(o.amountRemain / unit).format('0,0.[000000]')}
                      </Col>
                      <Col md={3} style={{ color: '#7fed63', textAlign: 'right' }}>
                        {numeral(o.price).format('0,0.[000000]')}
                      </Col>
                      <Col md={3} style={{ color: '#d6d8da', textAlign: 'center' }}>
                        {(this.props.id !== '') ? numeral(placeSum / unit).format('0,0.[000000]') : '-'}
                      </Col>
                    </div>
                  )
                })
              }
            </Col>
          </div>
          <div className={`row ${exchangeStyles.panelHeader2}`} >
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'right' }} md={2} >
              Bid
            </Col>
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'right' }} md={4} >
              Market Size
            </Col>
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'right' }} md={3} >
              Price
            </Col>
            <Col className={`${exchangeStyles.panelHeaderTitle2}`} style={{ textAlign: 'center' }} md={3} >
              My size
            </Col>
          </div>
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    buyOrders: getBuyOrders(state),
    sellOrders: getSellOrders(state),
    coinList: getCoinList(state),
    coin: getCoin(state),
    id: getId(state),
    rate: getRate(state),
  };
}
OrderList.propTypes = {
  dispatch: PropTypes.func,
  buyOrders: PropTypes.array.isRequired,
  sellOrders: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  rate: PropTypes.object.isRequired,
};
OrderList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrderList);
