import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Panel } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import styles from './Rate.css';
import { changeCoin } from '../../../App/AppActions';
import style from '../../../App/App.css';
class Rate extends Component {
  constructor(props){
    super(props);
    this.state = {
      coin: 'BTC',
    };
  }
  onBTC = () => {
    this.setState({ coin: 'BTC' });
    this.props.dispatch(changeCoin('BTC'));
  };
  onETH = () => {
    this.setState({ coin: 'ETH' });
    this.props.dispatch(changeCoin('ETH'));
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
            <th>USDT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4000</td>
            <td>300</td>
            <td>Poloniex</td>
          </tr>
          <tr>
            <td>4002</td>
            <td>289</td>
            <td>Bittrex</td>
          </tr>
          <tr>
            <td>~~~~</td>
            <td>~~~</td>
            <td>Diginex</td>
          </tr>
        </tbody>
      </Table>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}
Rate.propTypes = {
  dispatch: PropTypes.func,
};
Rate.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Rate);
