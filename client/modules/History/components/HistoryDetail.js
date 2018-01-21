import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table, Pagination, DropdownButton, MenuItem } from 'react-bootstrap';
import { setTransactionDetail, getConfirmation2, getConfirmation, setConfirmation, setHistoryMaxPage, setHistoryPage,
  addTransaction, changeCoin, fetchTransaction } from '../../App/AppActions';
import { getCoinList, getCoin, getUserName, getTransaction, getTransactionDetail, getHistoryMaxPage, getHistoryPage, getId } from '../../App/AppReducer';
import { getBuyOrder, getSellOrder } from "../../Exchange/ExchangeActions";
import numeral from 'numeral';
import style from '../../App/App.css';

class HistoryDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      confirmations: 'Loading'
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    }
  }
  componentDidMount() {
    const trans = this.props.detail;
    this.props.dispatch(getConfirmation2(trans.coin, trans.txCoin)).then((res) => {
      if (res.confirmations >= 6) {
        const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
        const unit = (coin.length > 0) ? coin[0].unit : 0;
        this.setState({ confirmations: numeral((trans.amount - trans.feeCoin) / unit).format('0,0.[000000]') });
      } else {
        this.setState({ confirmations: 'Not yet' });
      }
    });
  }
  detail = (transaction) => {
    this.props.dispatch(setTransactionDetail(transaction));
    if (JSON.stringify(this.props.transactionDetail) !== JSON.stringify(transaction)) {
      this.props.dispatch(setConfirmation(-1));
      const bool = this.props.userName === transaction.from.userName;
      const coin = bool ? transaction.coin : 'USDT';
      const txHash = bool ? transaction.txCoin : transaction.txUsdt;
      this.props.dispatch(getConfirmation(coin, txHash));
    }
  };
  render(){
    const trans = this.props.detail;
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;

    const usdt = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unit2 = (usdt.length > 0) ? usdt[0].unit : 0;

    const date = new Date(trans.dateCreated);
    const hours =  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const month =  date.getMonth() < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const day =  date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
    const time = `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}`;

    const total = trans.amount / unit * trans.price;
    return (
      <tr onClick={() => { this.detail(trans);}}>
        <th>{time}</th>
        <th>{(trans.hasOwnProperty('from') && this.props.userName === trans.from.userName) ? 'Sell' : 'Buy'}</th>
        <th>{numeral(trans.price).format('0,0.[000000]')}</th>
        <th>{numeral(trans.amount / unit).format('0,0.[000000]')}</th>
        <th>{numeral(total).format('0,0.[000000]')}</th>
        <th>{numeral(trans.feeCoin / unit).format('0,0.[000000]')}</th>
        <th>{numeral(trans.feeUsdt).format('0,0.[000000]')}</th>
        <th>{numeral(total - trans.feeUsdt).format('0,0.[000000]')}</th>
        <th>
          {
            (trans.from.userName === this.props.userName) ? (
              `${numeral(trans.amount / unit).format('0,0.[000000]')} ${trans.coin}`
            ) : (
              (trans.hasOwnProperty('confirmations') && trans.confirmations >= 6) ? (
                numeral((trans.amount - trans.feeCoin) / unit).format('0,0.[000000]')
              ) : (
                `${this.state.confirmations}`
              )
            )
          }
        </th>
      </tr>
    );
  }
}

function mapStateToProps(state) {
  return {
    userName: getUserName(state),
    transaction: getTransaction(state),
    transactionDetail: getTransactionDetail(state),
    coin: getCoin(state),
    coinList: getCoinList(state),
    id: getId(state),
    historyMaxPage: getHistoryMaxPage(state),
    historyPage: getHistoryPage(state),
  };
}
HistoryDetail.propTypes = {
  dispatch: PropTypes.func,
  detail: PropTypes.object.isRequired,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  transaction: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  transactionDetail: PropTypes.object.isRequired,
  historyMaxPage: PropTypes.number.isRequired,
  historyPage: PropTypes.number.isRequired,
};
HistoryDetail.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(HistoryDetail);
