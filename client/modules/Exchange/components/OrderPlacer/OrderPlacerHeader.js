import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Row, Col } from 'react-bootstrap';
import { getId, getCoin, getWallet, getCoinList } from '../../../App/AppReducer';
import { getBuyOrders, getSellOrders } from '../../../Exchange/ExchangeReducer';
import numeral from 'numeral';

class OrderPlacerHeader extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  render(){
    const buy = (this.props.buyOrders.length > 0) ? this.props.buyOrders[0].price : 0;
    const sel = (this.props.sellOrders.length > 0) ? this.props.sellOrders[0].price : 0;
    const top = (this.props.type === 'Mua') ? sel : buy;

    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    const wallet = this.props.wallets[this.props.coin];
    const balance = (wallet !== undefined) ? ((wallet.balance - wallet.hold) / unit) : 'NaN';

    const coin2 = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unit2 = (coin2.length > 0) ? coin2[0].unit : 0;
    const wallet2 = this.props.wallets['USDT'];
    const usdt = (wallet2 !== undefined) ? ((wallet2.balance - wallet2.hold) / unit2) : 'NaN';
    return (
      <Row>
        <Col md={12}>
          <div style={{ fontWeight: 'bold' }}>
            {this.props.type.toUpperCase()} {this.props.coin.toUpperCase()}
          </div>
        </Col>
        {
          (this.props.id !== '') ? (
              <Col md={12}>
                <Col md={12}>
                  {`Sở hữu: ${numeral(balance).format('0,0.000000')} ${this.props.coin}`}
                </Col>
                <Col md={12}>
                  {`Sở hữu: ${numeral(usdt).format('0,0.000000')} USDT`}
                </Col>
                <Col md={12}>
                  {`Tỷ giá đề nghị ${this.props.type === 'Mua' ? 'thấp' : 'cao'} nhất: ${top.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${this.props.type === 'Mua' ? `USDT/${this.props.coin}` : `${this.props.coin}/USDT`}`}
                </Col>
              </Col>
            ) : ''
        }
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
    buyOrders: getBuyOrders(state),
    sellOrders: getSellOrders(state),
    coin: getCoin(state),
    wallets: getWallet(state),
    coinList: getCoinList(state),
  };
}
OrderPlacerHeader.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  buyOrders: PropTypes.array.isRequired,
  sellOrders: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  wallets: PropTypes.object.isRequired,
};
OrderPlacerHeader.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrderPlacerHeader);
