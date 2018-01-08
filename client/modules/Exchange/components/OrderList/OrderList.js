import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table, Button, Col } from 'react-bootstrap';
import { deleteOrder, setNotify } from '../../../App/AppActions';
import { getSignIn, getSignUp, getUserName, getId, getCoinList, getCoin } from '../../../App/AppReducer';
import { stageInterpreter } from '../../../../util/functions';
import style from '../../../App/App.css';
import { getBuyOrders, getSellOrders } from '../../ExchangeReducer';
import exchangeStyles from '../../pages/Exchange.css';
import numeral from 'numeral';

class OrderList extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  render(){
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    return (
      <div className={`row ${exchangeStyles.main} ${exchangeStyles.textColor}`}>
        <Col md={12}>
          <h3 className={`${exchangeStyles.customLabel} ${exchangeStyles.noMargin}`}>
            Placed Orders
          </h3>
        </Col>
        <hr/>
        <Col md={12} style={{ backgroundColor: '#1e2b34' }} >
          <div className="row" style={{ height: '16px' }}>
            <Col md={4} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
              Volume
            </Col>
            <Col md={4} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
              Price
            </Col>
            <Col md={4} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
              Your size
            </Col>
          </div>
          <div className="row">
            <Col md={12} style={{ backgroundColor: '#1e2b34' }} >
              <div className="row">
                <hr style={{ marginBottom: '0' }}/>
              </div>
            </Col>
          </div>
          <div className="row">
            <Col md={12} style={{ backgroundColor: '#1e2b34', height: 'calc(100vh - 153px)', overflowY: 'hidden' }} >
                {
                  this.props.buyOrders.map((o, index) => {
                    let placeSum = 0;
                    o.userId.map((u) => {
                      if (u.userId === this.props.id) {
                        placeSum += u.amountRemain;
                      }
                    });
                    return (
                      <div className="row" key={index} onClick={() => this.props.onOrderClick(o)} style={{ cursor: 'pointer' }} >
                        <Col md={4} style={{ color: '#d6d8da' }}>
                          {numeral(o.amountRemain / unit).format('0,0.[000000]')}
                        </Col>
                        <Col md={4} style={{ color: '#7fed63' }}>
                          {numeral(o.price).format('0,0.[000000]')}
                        </Col>
                        <Col md={4} style={{ color: '#d6d8da' }}>
                          {(this.props.id !== '') ? numeral(placeSum / unit).format('0,0.[000000]') : '-'}
                        </Col>
                      </div>
                    )
                  })
                }
                <hr style={{ marginTop: '0', marginBottom: '0' }}/>
                {
                  this.props.sellOrders.map((o, index) => {
                    let placeSum = 0;
                    o.userId.map((u) => {
                      if (u.userId === this.props.id) {
                        placeSum += u.amountRemain;
                      }
                    });
                    return (
                      <div className="row" key={index} onClick={() => this.props.onOrderClick(o)}>
                        <Col md={4} style={{ color: '#d6d8da' }}>
                          {numeral(o.amountRemain / unit).format('0,0.[000000]')}
                        </Col>
                        <Col md={4} style={{ color: '#ff6939' }}>
                          {numeral(o.price).format('0,0.[000000]')}
                        </Col>
                        <Col md={4} style={{ color: '#d6d8da' }}>
                          {(this.props.id !== '') ? numeral(placeSum / unit).format('0,0.[000000]') : '-'}
                        </Col>
                      </div>
                    )
                  })
                }
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
};
OrderList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrderList);
