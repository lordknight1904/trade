import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table } from 'react-bootstrap';
import { onSignIn, onSignUp, logout } from '../../../App/AppActions';
import { getCoinList, getCoin } from '../../../App/AppReducer';
import style from '../../../App/App.css';
import { getSellOrders } from '../../ExchangeReducer';

class SellOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render(){
    let sum = 0;
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    return (
      <Panel header="Danh sách lệnh chờ Bán" style={{ minHeight: '550px', maxHeight: '550px', border: '1px solid #91abac' }} className={style.panelStyleTable}>
        <Table striped bordered condensed hover responsive className={style.tableStripped}>
          <thead>
            <tr>
              <th>Giá</th>
              <th>Số lượng Coin</th>
              <th>USDT</th>
              <th>Tổng cộng(USDT)</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.orders.map((order, index) => {
              sum += order.price * (order.amountRemain / unit);
              return (
                <tr key={index} onClick={() => this.props.orderTableClick(order)}>
                  <th>{order.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</th>
                  <th style={{fontWeight: 'normal', textAlign: 'right' }}>{(order.amountRemain / unit).toFixed(6)}</th>
                  <th style={{fontWeight: 'normal', textAlign: 'right' }}>{order.price * (order.amountRemain / unit)}</th>
                  <th style={{fontWeight: 'normal', textAlign: 'right' }}>{sum.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</th>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
    orders: getSellOrders(state),
    coinList: getCoinList(state),
    coin: getCoin(state),
  };
}
SellOrderList.propTypes = {
  dispatch: PropTypes.func,
  orderTableClick: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
};
SellOrderList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(SellOrderList);
