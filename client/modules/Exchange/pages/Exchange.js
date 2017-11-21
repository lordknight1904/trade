import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { onSignIn, onSignUp, logout } from '../../App/AppActions';
import { getId } from '../../App/AppReducer';
import Rate from '../components/Rate/Rate';
import OrderPlacer from '../components/OrderPlacer/OrderPlacer';
import BuyOrderList from '../components/BuyOrderList/BuyOrderList';
import SellOrderList from '../components/SellOrderList/SellOrderList';
import OrderList from '../components/OrderList/OrderList';
import History from '../components/History/History';

class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      buyOrderListSelected: {},
      sellOrderListSelected: {},
    };
  }
  orderTableClick = (order) => {
    if (order.type === 'sell') {
      this.setState({ buyOrderListSelected: order });
    }
    if (order.type === 'buy') {
      this.setState({ sellOrderListSelected: order });
    }
  };
  render(){
    return (
      <div>
        <Rate />
        <Row>
          <Col md={6}>
            <OrderPlacer type='Mua' orderListSelected={this.state.buyOrderListSelected} />
          </Col>
          <Col md={6}>
            <OrderPlacer type='Bán' orderListSelected={this.state.sellOrderListSelected} />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <SellOrderList orderTableClick={this.orderTableClick} />
          </Col>
          <Col md={6}>
            <BuyOrderList orderTableClick={this.orderTableClick} />
          </Col>
        </Row>

        {
          (this.props.id !== '') ? (
            <Row>
              <OrderList />
            </Row>
          ) : ''
        }

        <Row>
          <History />
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
  };
}
Exchange.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
};
Exchange.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Exchange);
