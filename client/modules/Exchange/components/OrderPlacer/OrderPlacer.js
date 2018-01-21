import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Form, InputGroup, Col, ControlLabel, Tabs, Tab, Nav, NavItem, FormGroup, FormControl, HelpBlock, Button  } from 'react-bootstrap';
import { onSignIn, onSignUp, setNotify } from '../../../App/AppActions';
import { getId, getCoinList, getCoin, getWallet, getSettings } from '../../../App/AppReducer';
import { createOrder } from '../../ExchangeActions';
import style from '../../../App/App.css';
import exchangeStyles from '../../pages/Exchange.css';
import numeral from 'numeral';

class OrderPlacer extends Component{
  constructor(props){
    super(props);
    this.state = {
      type: 'buy',
      amountBlock: '',
      priceBlock: '',

      amount: 0,
      price: 0,
      oldSelectedOrder: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.oldSelectedOrder._id !== nextProps.selectedOrder._id) {
      const coin = this.props.coinList.filter((c) => { return c.name === nextProps.selectedOrder.coin; });
      const unit = (coin.length > 0) ? coin[0].unit : 0;
      this.setState({
        oldSelectedOrder: nextProps.selectedOrder,
        type: (nextProps.selectedOrder.type === 'sell') ? 'buy' : 'sell',
        price: nextProps.selectedOrder.price,
        amount: nextProps.selectedOrder.amountRemain / unit,
        total: nextProps.selectedOrder.price * nextProps.selectedOrder.amountRemain / unit,
      });
    }
  }
  onAmount = (event) => {
    const count = (event.target.value.match(/\./g) || []).length;
    const number = numeral(event.target.value).format('0,0.[000000]');
    switch (count) {
      case 0: {
        this.setState({ amount: number });
        break;
      }
      case 1: {
        this.setState({ amount: event.target.value });
        break;
      }
      default: {
        this.setState({ amount: number });
        break;
      }
    }
  };
  onPrice = (event) => {
    const count = (event.target.value.match(/\./g) || []).length;
    const number = numeral(event.target.value).format('0,0.[000000]');
    switch (count) {
      case 0: {
        this.setState({ price: number });
        break;
      }
      case 1: {
        this.setState({ price: event.target.value });
        break;
      }
      default: {
        this.setState({ price: number });
        break;
      }
    }
  };
  handleSelect = (type) => {
    this.setState({ type });
  };

  onOrder = () => {
    if (this.props.id === '') {
      this.props.dispatch(setNotify('Sign In or Sign up to start trading.'));
      return;
    }
    if (numeral(this.state.price).value() <= 0) {
      this.props.dispatch(setNotify('Price must be greater than 0.'));
      return;
    }
    if (numeral(this.state.amount).value() <= 0) {
      this.props.dispatch(setNotify('Amount must be greater than 0.'));
      return;
    }
    let coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    if (coin.length < 0) {
      return;
    }
    const order = {
      userId: this.props.id,
      type: this.state.type,
      coin: this.props.coin,
      price: numeral(this.state.price).value(),
      amount: numeral(this.state.amount).value() * Number(coin[0].unit),
    };
    this.setState({ isSending: true });
    this.props.dispatch(createOrder(this.props.token, order)).then((res) => {
      this.setState({ isSending: false });
      if (res.order === 'success') {
        this.setState({ price: 0, amount: 0 });
        this.props.dispatch(setNotify('Orders successful placed.'));
      } else {
        this.props.dispatch(setNotify(res.order.toString()));
      }
    })
  };
  render() {
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    const wallet = this.props.wallets[this.props.coin];
    const balance = (wallet !== undefined) ? ((wallet.balance) / unit) : 'NaN';

    const wallet2 = this.props.wallets['USDT'];
    const usdt = (wallet2 !== undefined) ? (wallet2.balance - wallet2.hold) : 'NaN';

    const feeUsdtArr = this.props.settings.filter(set => {return set.name == 'feeUsdt';});
    const feeUsdt = (feeUsdtArr.length > 0) ? Number(feeUsdtArr[0].value) : 0;

    const total = numeral(this.state.amount).value() * numeral(this.state.price).value();
    return (
      <div className={`row ${exchangeStyles.main}`} >
        {
          (this.props.id !== '') ? (
            <Col md={12} className={`${exchangeStyles.panelHeader}`}>
              <div className={`${exchangeStyles.panelHeaderTitle}`}>
                WALLET
              </div>
            </Col>
          ) : ''
        }
        {
          (this.props.id !== '') ? (
              <Col md={12} style={{ marginTop: '10px' }}>
                <FormGroup controlId='coinOwnLabel'>
                  <ControlLabel className={exchangeStyles.customLabel}>{this.props.coin}</ControlLabel>
                  <ControlLabel className={exchangeStyles.customLabel} style={{ float: 'right' }}>{balance}</ControlLabel>
                </FormGroup>

                <FormGroup controlId='usdtOwnLabel'>
                  <ControlLabel className={exchangeStyles.customLabel}>USDT</ControlLabel>
                  <ControlLabel className={exchangeStyles.customLabel} style={{ float: 'right' }}>{numeral(usdt).format('0,0.[000000]')}</ControlLabel>
                </FormGroup>
              </Col>
            ) : ''
        }
        <Col md={12} className={`${exchangeStyles.panelHeader}`}>
          <div className={`${exchangeStyles.panelHeaderTitle}`}>
            ORDER FORM
          </div>
        </Col>
        <Col md={12} style={{ marginTop: '10px' }}>
          <button
            className={`${exchangeStyles.modeButton} ${(this.state.type === 'buy') ? exchangeStyles.buyActive : ''}`}
            onClick={() => this.handleSelect('buy')}
          >
            BUY
          </button>
          <button
            className={`${exchangeStyles.modeButton} ${(this.state.type === 'sell') ? exchangeStyles.sellActive : ''}`}
            onClick={() => this.handleSelect('sell')}
          >
            SELL
          </button>
        </Col>
        <Col md={12} style={{ marginTop: '10px' }}>
          <Form>
            <FormGroup controlId='formAmount'>
              <ControlLabel className={exchangeStyles.customLabel}>Amount</ControlLabel>
              <FormControl autoComplete='off' type="text" value={this.state.amount} onChange={this.onAmount} style={{ backgroundColor: '#404a52', color: 'white' }}/>
              {
                (this.state.amountBlock !== '') ? (
                    <HelpBlock>{this.state.amountBlock}</HelpBlock>
                  ) : ''
              }
            </FormGroup>
            <FormGroup controlId='formPrice'>
              <ControlLabel className={exchangeStyles.customLabel}>Price</ControlLabel>
              <FormControl autoComplete='off' type="text" value={numeral(this.state.price).format('0,0.[000000]')} onChange={this.onPrice} style={{ backgroundColor: '#404a52', color: 'white' }}/>
              {
                (this.state.priceBlock !== '') ? (
                    <HelpBlock>{this.state.amountBlock}</HelpBlock>
                  ) : ''
              }
            </FormGroup>
            <FormGroup controlId='totalLabel'>
              <ControlLabel className={exchangeStyles.customLabel}>Total</ControlLabel>
              <ControlLabel className={exchangeStyles.customLabel} style={{ float: 'right' }}>
                {`${numeral(total).format('0,0.[000000]')} USDT`}
              </ControlLabel>
            </FormGroup>
            <FormGroup controlId='totalLabel'>
              <ControlLabel className={exchangeStyles.customLabel}>Fee</ControlLabel>
              <ControlLabel className={exchangeStyles.customLabel} style={{ float: 'right' }}>
                {`${numeral(total * feeUsdt / 100).format('0,0.[000000]')} USDT`}
              </ControlLabel>
            </FormGroup>
            <FormGroup controlId='totalLabel'>
              <ControlLabel className={exchangeStyles.customLabel}>{`Total ${(this.state.type === 'buy') ? '+' : '-'} Fee`}</ControlLabel>
              <ControlLabel className={exchangeStyles.customLabel} style={{ float: 'right' }}>
                {`${numeral(total *(100 + ((this.state.type === 'buy') ? 1 : -1) * feeUsdt) /100).format('0,0.[000000]')} USDT`}
              </ControlLabel>
            </FormGroup>
            <button type="button" disabled={this.state.isSending} onClick={this.onOrder} className={`${exchangeStyles.submitButton} ${(this.state.type === 'buy') ? exchangeStyles.buyActive : exchangeStyles.sellActive}`}>
              {
                (this.state.isSending) ? (
                  'SUBMITTING'
                ) : (
                  (this.state.type === 'buy') ?
                    'PLACE BUY ORDER' :
                    'PLACE SELL ORDER'
                )
              }
            </button>
          </Form>
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
    coin: getCoin(state),
    coinList: getCoinList(state),
    wallets: getWallet(state),
    settings: getSettings(state),
  };
}
OrderPlacer.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  coinList: PropTypes.array.isRequired,
  settings: PropTypes.array.isRequired,
  wallets: PropTypes.object.isRequired,
};
OrderPlacer.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrderPlacer);
