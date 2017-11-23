import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Panel, Table, Button } from 'react-bootstrap';
import { deleteOrder, setNotify } from '../../../App/AppActions';
import { getSignIn, getSignUp, getUserName, getOpenOrders, getCoinList, getCoin } from '../../../App/AppReducer';
import { stageInterpreter } from '../../../../util/functions';
import numeral from 'numeral';
import style from '../../../App/App.css';

class OrderList extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  onDelete = (orderId) => {
    const del = {
      orderId,
      userName: this.props.userName,
    };
    this.props.dispatch(deleteOrder(del)).then((res) => {
      if (res.order === 'success') {
        this.props.dispatch(setNotify('Xóa lệnh thành công'));
      } else {
        this.props.dispatch(setNotify(res.order));
      }
    });
  };
  render(){
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
    return (
      <div className='col-md-12'>
        <Panel header='Danh sách lệnh chờ của bạn' className={style.panelStyleTable}>
          <Table striped bordered condensed hover responsive>
            <thead>
              <tr>
                <th>Loại</th>
                <th>Giá(USDT)</th>
                <th>Số lượng(coin)</th>
                <th>Tổng cộng(USDT)</th>
                <th>Ngày đặt lệnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.openOrders.map((o, index) => {
                  const date = new Date(o.dateCreated);
                  const hours =  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
                  const minutes =  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                  const time = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${hours}:${minutes}`;
                  return (
                    <tr key={index}>
                      <th style={{ verticalAlign: 'middle' }}>{stageInterpreter(o.type)}</th>
                      <th style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>{numeral(o.balance).format('0,0.000000')}</th>
                      <th style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>{o.amountRemain / unit}</th>
                      <th style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>{(o.price * o.amountRemain) / unit}</th>
                      <th style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>{time}</th>
                      <th style={{ fontWeight: 'normal', verticalAlign: 'middle', textAlign: 'center' }}>
                        <Button bsStyle="link" onClick={() => this.onDelete(o._id)}>Hủy</Button>
                      </th>
                    </tr>
                  )
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
    openOrders: getOpenOrders(state),
    coinList: getCoinList(state),
    coin: getCoin(state),
    userName: getUserName(state),
  };
}
OrderList.propTypes = {
  dispatch: PropTypes.func,
  openOrders: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};
OrderList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(OrderList);
