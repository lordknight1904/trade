import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table, Pagination, DropdownButton, MenuItem } from 'react-bootstrap';
import { setTransactionDetail, getConfirmation, setConfirmation, setHistoryMaxPage, setHistoryPage,
  addTransaction, changeCoin, fetchTransaction } from '../../App/AppActions';
import { getCoinList, getCoin, getUserName, getTransaction, getTransactionDetail, getHistoryMaxPage, getHistoryPage, getId } from '../../App/AppReducer';
import { getBuyOrder, getSellOrder } from "../../Exchange/ExchangeActions";
import HistoryDetail from '../components/HistoryDetail';
import numeral from 'numeral';
import style from '../../App/App.css';

class History extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    }
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
  changeCoin = (eventKey) => {
    this.props.dispatch(changeCoin(eventKey));
    this.props.dispatch(getSellOrder(eventKey));
    this.props.dispatch(getBuyOrder(eventKey));
    this.props.dispatch(addTransaction([]));
    this.props.dispatch(fetchTransaction(this.props.userName, eventKey, 0));
  };
  onPage = (eventKey) => {
    this.props.dispatch(setHistoryPage(eventKey));
    this.props.dispatch(fetchTransaction(this.props.userName, this.props.coin, eventKey - 1));
  };
  render() {
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;

    const usdt = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unit2 = (usdt.length > 0) ? usdt[0].unit : 0;
    return (
      <div className={style.container} style={{ marginTop: '-50px' }} >
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <DropdownButton id="coinDropDownHistory" bsStyle="info" title={this.props.coin} onSelect={this.changeCoin} >
            {
              this.props.coinList.map((cl, index) => {
                if (cl.name !== 'USDT') {
                  return (
                    <MenuItem key={index} eventKey={cl.name}>{cl.name}</MenuItem>
                  )
                }
              })
            }
          </DropdownButton>
          <Pagination
            bsSize="small"
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.historyMaxPage}
            maxButtons={5}
            activePage={this.props.historyPage}
            onSelect={this.onPage}
            style={{
              display: 'table',
              margin: 'auto auto auto 20px'
            }}
          />
        </div>
        <Panel header="Completed transactions" className={style.panelStyleTable}>
          <Table striped bordered condensed hover responsive className={style.tableStripped}>
            <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>{`USDT/${this.props.coin}`}</th>
              <th>{`Amount(${this.props.coin})`}</th>
              <th>Total(USDT)</th>
              <th>{`Net Fee(${this.props.coin})`}</th>
              <th>Trans Fee(USDT)</th>
              <th>Total with Fee(USDT)</th>
              <th>{`Confirm(${this.props.coin})`}</th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.transaction.map((trans, index) => {
                return (
                  <HistoryDetail key={index} detail={trans} />
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
    id: getId(state),
    historyMaxPage: getHistoryMaxPage(state),
    historyPage: getHistoryPage(state),
  };
}
History.propTypes = {
  dispatch: PropTypes.func,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  transaction: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  transactionDetail: PropTypes.object.isRequired,
  historyMaxPage: PropTypes.number.isRequired,
  historyPage: PropTypes.number.isRequired,
};
History.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(History);
