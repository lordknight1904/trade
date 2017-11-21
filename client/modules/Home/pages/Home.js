import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatButton, FontIcon } from 'material-ui';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Home.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Home);
