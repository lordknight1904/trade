import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table } from 'react-bootstrap';
import { setTransactionDetail, getConfirmation, setConfirmation } from '../../../App/AppActions';
import { getCoinList, getCoin, getUserName, getTransaction, getTransactionDetail } from '../../../App/AppReducer';
import numeral from 'numeral';
import style from '../../../App/App.css';
class History extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
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
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;

    const usdt = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unit2 = (usdt.length > 0) ? usdt[0].unit : 0;
    return (
      <div className="col-md-12">
        <Panel header="Các giao dịch đã thực hiện" className={style.panelStyleTable}>
          <Table striped bordered condensed hover responsive>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Loại</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Phí</th>
                <th>Tổng cộng(USDT)</th>
              </tr>
            </thead>
            <tbody>
            {
              this.props.transaction.map((trans, index) => {
                const date = new Date(trans.dateCreated);
                const hours =  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
                const minutes =  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                const time = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${hours}:${minutes}`;
                return (
                  <tr key={index} onClick={() => { this.detail(trans);}}>
                    <th>{time}</th>
                    <th>{(this.props.userName === trans.from.userName) ? 'Bán' : 'Mua'}</th>
                    <th>{numeral(trans.price).format('0,0.000000')}</th>
                    <th>{numeral(trans.amount / unit).format('0,0.000000')}</th>
                    <th>
                      {
                        (this.props.userName === trans.from.userName) ?
                          `${numeral(trans.feeCoin / unit).format('0,0.000000')} ${trans.coin}`
                          : `${numeral(trans.feeUsdt / unit2).format('0,0.000000')} USDT`
                      }
                      </th>
                    <th>{trans.amount / unit * trans.price }</th>
                  </tr>
                );
              })
            }
            </tbody>
          </Table>
        </Panel>
      </div>
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
  };
}
History.propTypes = {
  dispatch: PropTypes.func,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  transaction: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
  transactionDetail: PropTypes.object.isRequired,
};
History.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(History);
