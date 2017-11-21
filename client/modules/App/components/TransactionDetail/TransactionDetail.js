import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getId, getDetail, getTransactionDetail, getUserName, getCoinList, getCoin, getConfirmations } from '../../AppReducer';
import { closeTransactionDetail } from '../../AppActions';
import { Modal, Table } from 'react-bootstrap';
import numeral from 'numeral';

class TransactionDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  onHideTx = () => {
    this.props.dispatch(closeTransactionDetail());
  };
  render(){
    const transactionDetail = this.props.transactionDetail;
    if (!transactionDetail.hasOwnProperty('from') || !transactionDetail.hasOwnProperty('to')) return null;
    const txCoin = transactionDetail.coin;
    const bool = transactionDetail.from.userName === this.props.userName;
    const coin = this.props.coinList.filter((c) => { return c.name === transactionDetail.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    const usdt = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unitUsdt = (usdt.length > 0) ? usdt[0].unit : 0;
    const amount = (bool) ? transactionDetail.amount / unit : transactionDetail.amount / unit * transactionDetail.price;
    const fee = (bool) ? transactionDetail.feeCoin / unit : transactionDetail.feeUsdt / unitUsdt;
    const receive = amount - fee;
    return (
      <Modal show={this.props.detail} onHide={this.onHideTx}>
        <Modal.Body>
          <Table striped bordered condensed hover style={{ tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                <td colSpan="2">
                  <h2 style={{ textAlign: 'center' }}>
                    Thông tin về giao dịch
                  </h2>
                </td>
              </tr>

              <tr>
                <td style={{ fontWeight: 'bold' }}>Loại giao dịch</td>
                <td>{(bool) ? `Bán ${transactionDetail.coin}` : `Mua ${transactionDetail.coin}`}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 'bold' }}>Số lượng</td>
                <td>{`${numeral(amount).format('0,0.000000')} ${(bool) ? txCoin : 'USDT'}`} </td>
              </tr>

              <tr>
                <td style={{ fontWeight: 'bold' }}>Phí</td>
                <td>{`${numeral(fee).format('0,0.000000')} ${(bool) ? txCoin : 'USDT'}`}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 'bold' }}>Số lượng nhận được</td>
                <td>{`${numeral(receive).format('0,0.000000')} ${(bool) ? txCoin : 'USDT'}`}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Coin transaction hash</td>
                <td style={{ wordWrap: 'break-word' }}>{transactionDetail.txCoin}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 'bold' }}>Usdt transaction hash</td>
                <td style={{ wordWrap: 'break-word' }}>{transactionDetail.txUsdt}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 'bold' }}>Mức độ xác thực</td>
                <td>{(this.props.confirmations === -1) ? 'Đang tải' : this.props.confirmations}</td>
              </tr>

            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
    detail: getDetail(state),
    transactionDetail: getTransactionDetail(state),
    userName: getUserName(state),
    coin: getCoin(state),
    coinList: getCoinList(state),
    confirmations: getConfirmations(state),
  };
}
TransactionDetail.propTypes = {
  dispatch: PropTypes.func,
  userName: PropTypes.string.isRequired,
  detail: PropTypes.bool.isRequired,
  transactionDetail: PropTypes.object.isRequired,
  coin: PropTypes.string.isRequired,
  coinList: PropTypes.array.isRequired,
  confirmations: PropTypes.number.isRequired,
};
TransactionDetail.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TransactionDetail);
