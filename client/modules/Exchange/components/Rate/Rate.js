import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Panel } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import styles from './Rate.css';
import { changeCoin, fetchTransaction, addTransaction } from '../../../App/AppActions';
import { getCoinList, getUserName, getCoin } from '../../../App/AppReducer';
import style from '../../../App/App.css';
import { getRate } from "../../ExchangeReducer";
import { getSellOrder, getBuyOrder, fetchRate } from '../../../Exchange/ExchangeActions';
import numeral from 'numeral';

class Rate extends Component {
  constructor(props){
    super(props);
    this.state = {
      coin: 'BTC',
    };
  }
  componentDidMount() {
    this.props.coinList.map((cl) => {
      if (cl.name !== 'USDT') {
        this.props.dispatch(fetchRate(cl.name));
      }
    });
  }
  onBTC = () => {
    this.setState({ coin: 'BTC' });
    this.props.dispatch(changeCoin('BTC'));
    this.props.dispatch(getSellOrder('BTC'));
    this.props.dispatch(getBuyOrder('BTC'));
    this.props.dispatch(addTransaction([]));
    this.props.dispatch(fetchTransaction(this.props.userName, 'BTC', 0));
  };
  onETH = () => {
    this.setState({ coin: 'ETH' });
    this.props.dispatch(changeCoin('ETH'));
    this.props.dispatch(getSellOrder('ETH'));
    this.props.dispatch(getBuyOrder('ETH'));
    this.props.dispatch(addTransaction([]));
    this.props.dispatch(fetchTransaction(this.props.userName, 'ETH', 0));
  };
  render() {
    return (
      <Panel header="BẢNG GIÁ" style={{ border: '1px solid #91abac' }} className={style.panelStyleTable}>
        <Table striped bordered condensed hover responsive style={{ marginBottom: '0' }}>
          <thead>
            <tr>
              <th style={{ padding: '0' }}>
                <FlatButton
                  className={styles.customButton}
                  label="BTC"
                  onClick={this.onBTC}
                  primary={this.props.coin === 'BTC'}
                  labelStyle={{ fontSize: '1.1em' }}
                />
              </th>
              <th style={{ padding: '0' }}>
                <FlatButton
                  className={styles.customButton}
                  label="ETH"
                  onClick={this.onETH}
                  primary={this.props.coin === 'ETH'}
                  labelStyle={{ fontSize: '1.1em' }}
                />
              </th>
              <th>/</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>{(this.props.rate['BTC']) ? numeral(this.props.rate['BTC'].price).format('0,0.[000000]') : '~'}</td>
              <td style={{ textAlign: 'center' }}>{(this.props.rate['ETH']) ? numeral(this.props.rate['ETH'].price).format('0,0.[000000]') : '~'}</td>
              <td>USDT</td>
            </tr>
          </tbody>
        </Table>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
    coinList: getCoinList(state),
    coin: getCoin(state),
    rate: getRate(state),
    userName: getUserName(state),
  };
}
Rate.propTypes = {
  dispatch: PropTypes.func,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  rate: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
};
Rate.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Rate);
