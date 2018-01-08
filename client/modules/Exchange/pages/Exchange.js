import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { onSignIn, onSignUp, logout } from '../../App/AppActions';
import { getId } from '../../App/AppReducer';
import OrderPlacer from '../components/OrderPlacer/OrderPlacer';
import OrderList from '../components/OrderList/OrderList';
import History from '../components/History/History';
import appStyles from '../../App/App.css';
import Graph from '../components/Graph/Graph';
import OpenOrders from '../components/OpenOrders/OpenOrders';

class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedOrder: {},
    };
  }
  onOrderClick = (order) => {
    this.setState({ selectedOrder: order });
  };
  render(){
    return (
      <div style={{ backgroundColor: '##3a444d' }}>
        <Col md={2}>
          <OrderPlacer selectedOrder={this.state.selectedOrder}/>
        </Col>
        <Col md={3}>
          <OrderList onOrderClick={this.onOrderClick} />
        </Col>
        <Col md={7}>
          <div className="row">
            <Graph/>
          </div>
          <div className="row">
            <OpenOrders />
          </div>
        </Col>
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
