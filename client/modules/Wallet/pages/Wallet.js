import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getId, getWallet, getCoinList } from '../../App/AppReducer';
import { setNotify, directSend } from '../../App/AppActions';
import { Table, FormGroup, HelpBlock, FormControl, Button } from 'react-bootstrap';
import numeral from 'numeral';
import styles from '../wallet.css';
import appStyles from '../../App/App.css';

class Wallet extends Component{
  constructor(props){
    super(props);
    this.state = {
      type: '',
      coin: {},
      address: '',
      amount: 0,
      isSending: false,
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    }
  }
  handleAction = (type, coin) => {
    this.setState({ type, coin });
  };
  onCancel = () => {
    this.setState({ type: '', coin: {} });
  };
  sendCoin = () => {
    if (this.state.address.trim() === '') {
      this.props.dispatch(setNotify('Địa chỉ nhập sai.'));
      return;
    }
    if (isNaN(this.state.amount.trim())) {
      this.props.dispatch(setNotify('Số lượng sai'));
      return;
    }
    const send = {
      id: this.props.id,
      coin: this.state.coin.name,
      address: this.state.address,
      amount: Number(this.state.amount) * Number(this.state.coin.unit),
    };
    this.setState({ isSending: true });
    this.props.dispatch(directSend(send)).then((res) => {
      this.setState({ isSending: false });
      this.props.dispatch(setNotify(res.order));
    });
  };
  onAddress = (event) => { this.setState({ address: event.target.value }); };
  onAmount = (event) => { this.setState({ amount: event.target.value }); };
  render(){
    const wallet = this.props.wallet;
    const coin = this.props.coinList.filter((cl) => {return cl.name === this.state.coin;});
    return (
      <Table striped bordered condensed hover className={`${styles.tableStripped} ${appStyles.container}`} >
        <thead>
          <tr>
            <th>Coin</th>
            <th>Số dư</th>
            <th>Chưa xác thực</th>
            <th>Tạm khóa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
        {
          (this.state.type === 'address') ? (
            <tr>
              <th colSpan="4">
                <p>{`Địa chỉ ví ${this.state.coin.name}:`}</p><br/>
                <p>{wallet[this.state.coin.name].address.trim()}</p><br/>
                <p>{`Chuyển ${this.state.coin.name} đến địa chỉ trên`}</p><br/>
              </th>
              <th>
                <p className={styles.pHover} style={{ float: 'left' }} onClick={this.onCancel}>Hủy</p>
              </th>
            </tr>
          ) : ''
        }
        {
          (this.state.type === 'send') ? (
            <tr>
              <th colSpan="4" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                <FormGroup style={{ marginBottom: '5px' }} >
                  <FormControl type="text" onChange={this.onAddress} placeholder={`Đỉa chỉ ví ${this.state.coin.name} nhận`}style={{ marginBottom: '5px' }} />
                  <FormControl type="text" onChange={this.onAmount} placeholder="Số lượng" />
                </FormGroup>
                <p style={{ float: 'left' }}>Phí chuyển</p>
                <p style={{ float: 'right'}}>{}</p>
                <br/>
                <Button style={{ float: 'right' }} bsStyle="primary" bsSize="xsmall" disabled={this.state.isSending} onClick={this.sendCoin}>Gửi</Button>
              </th>
              <th>
                <p className={styles.pHover} style={{ float: 'left' }}>Hủy</p>
              </th>
            </tr>
          ) : ''
        }
        {
          this.props.coinList.map((cl, index) => (
            <tr key={index}>
              <th>{cl.name}</th>
              <th style={{ fontWeight: 'normal', textAlign: 'right' }}>{wallet[cl.name] ? numeral(wallet[cl.name].balance / cl.unit).format('0,0.[000000]') : '~'}</th>
              <th style={{ fontWeight: 'normal', textAlign: 'right' }}>{wallet[cl.name] ? numeral(wallet[cl.name].unconfirmedBalance / cl.unit).format('0,0.[000000]') : '~'}</th>
              <th style={{ fontWeight: 'normal', textAlign: 'right' }}>{wallet[cl.name] ? numeral(wallet[cl.name].hold / cl.unit).format('0,0.[000000]') : '~'}</th>
              <th style={{ fontWeight: 'normal' }}>
                <p className={styles.pHover} style={{ float: 'left' }} onClick={() => this.handleAction('address', cl)}>Nạp Coin</p>
                <p className={styles.pHover} style={{ float: 'right' }} onClick={() => this.handleAction('send', cl)}>Chuyển Coin</p>
              </th>
            </tr>
          ))
        }
        </tbody>
      </Table>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
    wallet: getWallet(state),
    coinList: getCoinList(state),
  };
}
Wallet.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
  coinList: PropTypes.array.isRequired,
};
Wallet.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Wallet);
