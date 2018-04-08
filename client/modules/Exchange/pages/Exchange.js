import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { getId } from '../../App/AppReducer';
import OrderPlacer from '../components/OrderPlacer/OrderPlacer';
import OrderList from '../components/OrderList/OrderList';
import Graph from '../components/Graph/Graph';
import Chart from '../components/Chart/Chart.js';
import OpenOrders from '../components/OpenOrders/OpenOrders';
import exchangeStyles from '../pages/Exchange.css';
import { getChartIndex } from '../ExchangeReducer';
import { Tabs, Tab } from 'material-ui/Tabs';

class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: {},
    };
  }
  onOrderClick = (order) => {
    this.setState({ selectedOrder: order });
  };
  render() {
    return (
      <div style={{ backgroundColor: '##3a444d' }}>
        <Col md={2}>
          <OrderPlacer selectedOrder={this.state.selectedOrder} />
        </Col>
        <Col md={3}>
          <OrderList onOrderClick={this.onOrderClick} />
        </Col>
        <Col md={7}>
          <div className="row">
            <Tabs
              className={`${exchangeStyles.panelHeader4}`}
              tabItemContainerStyle={{
                height: '40px',
                backgroundColor: '#2f3d45',
              }}
              onChange={this.handleChange}
              value={this.props.chartIndex}
            >
              <Tab label="PRICE CHART" value={0}>
                <Graph />
              </Tab>
              <Tab label="DEPTH CHART" value={1}>
                <Chart />
              </Tab>
            </Tabs>
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
    chartIndex: getChartIndex(state),
  };
}
Exchange.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  chartIndex: PropTypes.number.isRequired,
};
Exchange.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Exchange);
