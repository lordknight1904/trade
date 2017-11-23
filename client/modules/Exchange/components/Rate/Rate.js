import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Panel } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import styles from './Rate.css';
import { changeCoin } from '../../../App/AppActions';
import { getCoinList } from '../../../App/AppReducer';
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
  };
  onETH = () => {
    this.setState({ coin: 'ETH' });
    this.props.dispatch(changeCoin('ETH'));
    this.props.dispatch(getSellOrder('ETH'));
    this.props.dispatch(getBuyOrder('ETH'));
  };
  render() {
    return (
      <Panel header="BẢNG GIÁ" style={{ border: '1px solid #91abac' }} className={style.panelStyleTable}>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th style={{ padding: '0' }}>
                <FlatButton
                  className={styles.customButton}
                  label="BTC"
                  onClick={this.onBTC}
                  primary={this.state.coin === 'BTC'}
                  labelStyle={{ fontSize: '1.1em' }}
                />
              </th>
              <th style={{ padding: '0' }}>
                <FlatButton
                  className={styles.customButton}
                  label="ETH"
                  onClick={this.onETH}
                  primary={this.state.coin === 'ETH'}
                  labelStyle={{ fontSize: '1.1em' }}
                />
              </th>
              <th>/</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>{(this.props.rate['BTC']) ? numeral(this.props.rate['BTC'].price).format('0,0') : '~'}</td>
              <td style={{ textAlign: 'center' }}>{(this.props.rate['ETH']) ? numeral(this.props.rate['ETH'].price).format('0,0') : '~'}</td>
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
    rate: getRate(state),
  };
}
Rate.propTypes = {
  dispatch: PropTypes.func,
  coinList: PropTypes.array.isRequired,
  rate: PropTypes.object.isRequired,
};
Rate.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Rate);
