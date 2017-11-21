import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Form, FormGroup, InputGroup, FormControl, Col, ControlLabel, Button } from 'react-bootstrap';
import { onSignIn, onSignUp, setNotify } from '../../../App/AppActions';
import { getId, getToken, getCoin, getCoinList } from '../../../App/AppReducer';
import OrderPlacerHeader from './OrderPlacerHeader';
import { createOrder } from '../../ExchangeActions';
import style from '../../../App/App.css';
class OrderPlacer extends Component{
  constructor(props){
    super(props);
    this.state = {
      price: 0,
      amount: 0,
      total: 0,

      base: 'price',
      oldOrderListSelected: {},
      isSending: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.oldOrderListSelected._id !== nextProps.orderListSelected._id) {
      const coin = this.props.coinList.filter((c) => { return c.name === nextProps.orderListSelected.coin; });
      const unit = (coin.length > 0) ? coin[0].unit : 0;
      this.setState({
        oldOrderListSelected: nextProps.orderListSelected,
        price: nextProps.orderListSelected.price,
        amount: nextProps.orderListSelected.amountRemain / unit,
        total: nextProps.orderListSelected.price * nextProps.orderListSelected.amountRemain / unit,
      });
    }
  }
  isNumber = (n) => {
    return !isNaN(+n) && isFinite(n);
  };
  onChangePrice = (event) => {
    let number = Number(parseFloat(event.target.value.trim()));
    if (number < 0) return;
    const checkLength = number.toString().indexOf('.');
    if (checkLength > -1) {
      if (number.toString().substr(checkLength+1, checkLength + 6).length == 6) {
        number = number.toFixed(6);
      }
      if (number.toString().substr(checkLength+1, checkLength + 6).length > 6) {
        return;
      }
    }
    this.setState({ price: number, total: (number) * this.state.amount, base: 'price' });
  };
  onChangeAmount = (event) => {
    let number = Number(parseFloat(event.target.value.trim()));
    if (number < 0) return;
    const checkLength = number.toString().indexOf('.');
    if (checkLength > -1) {
      if (number.toString().substr(checkLength+1, checkLength + 6).length == 6) {
        number = number.toFixed(6);
      }
      if (number.toString().substr(checkLength+1, checkLength + 6).length > 6) {
        return;
      }
    }
    this.setState({ amount: number, total: number * this.state.price, base: 'amount' });
  };
  onChangeTotal = (event) => {
    if (this.isNumber(event.target.value.trim())) {
      if (event.target.value.trim() < 0) return;
      switch (this.state.base) {
        case 'price': {
          this.setState({ total: event.target.value.trim(), amount: Number(event.target.value.trim()) / this.state.price });
          break;
        }
        case 'amount': {
          this.setState({ total: event.target.value.trim(), price: Number(event.target.value.trim()) / this.state.amount });
          break;
        }
        default: break;
      }
    }
  };
  onOrder = () => {
    if (this.isNumber(this.state.price) && Number(this.state.price) > 0 &&
      this.isNumber(this.state.amount) && Number(this.state.amount) > 0
    ) {
      const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; })[0];
      const order = {
        userId: this.props.id,
        type: (this.props.type === 'Mua') ? 'buy' : 'sell',
        coin: this.props.coin,
        price: Number(this.state.price),
        amount: Number(this.state.amount) * Number(coin.unit),
      };
      this.setState({ isSending: true });
      this.props.dispatch(createOrder(this.props.token, order)).then((res) => {
        this.setState({ isSending: false });
        if (res.order === 'success') {
          this.props.dispatch(setNotify('Đặt lệnh thành công.'));
        } else {
          this.props.dispatch(setNotify(res.order.toString()));
        }
      })
    } else {
      this.props.dispatch(setNotify('Xin vui lòng kiểm tra thông tin nhập.'));
    }
  };
  render() {
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; })[0];
    return (
      <Panel header={<OrderPlacerHeader type={this.props.type} />} style={{ border: '1px solid #91abac' }} className={style.panelStyle}>
        <Form horizontal>
          <FormGroup>
            <Col sm={3} className="control-label">Giá</Col>
            <Col sm={9}>
              <InputGroup>
                <FormControl type="number" onChange={this.onChangePrice} value={this.state.price} />
                <InputGroup.Addon style={{ width: '100px' }}>USDT</InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} className="control-label">Số lượng</Col>
            <Col sm={9}>
              <InputGroup>
                <FormControl type="number" onChange={this.onChangeAmount} value={this.state.amount} />
                <InputGroup.Addon style={{ width: '100px' }}>{coin.name}</InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
          {/*<span style={{ margin: 'auto', display: 'block', width: '75%', borderTop: '1px solid #ccc', marginBottom: '20px' }} />*/}
          <FormGroup style={{ marginBottom: '35px' }}>
            <Col sm={3} className="control-label">Tổng cộng</Col>
            <Col sm={9}>
              <InputGroup>
                <FormControl type="text" onChange={this.onChangeTotal} value={Number(this.state.total).toFixed(6)} />
                <InputGroup.Addon style={{ width: '100px' }}>USDT</InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>


          <p>Phí giao dịch chiếm 0.2% tổng giá trị lệnh</p>

          {
            (this.props.id) ? (
                <FormGroup>
                  <Col mdOffset={9} md={2}>
                    <Button onClick={this.onOrder} disabled={this.state.isSending}>{this.props.type}</Button>
                  </Col>
                </FormGroup>
              ) : (
                <FormGroup>
                  <Button bsStyle="link" onClick={() => this.props.dispatch(onSignIn())}>Đăng nhập</Button>
                  hoặc
                  <Button bsStyle="link" onClick={() => this.props.dispatch(onSignUp())}>đăng ký</Button>
                  để bắt đầu giao dịch
                </FormGroup>
              )
          }
        </Form>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
    token: getToken(state),
    coin: getCoin(state),
    coinList: getCoinList(state),
  };
}
OrderPlacer.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  coinList: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  orderListSelected: PropTypes.object.isRequired,
};
OrderPlacer.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrderPlacer);
