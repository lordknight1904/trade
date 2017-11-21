import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { confirmUser } from '../UserActions';


class Confirm extends Component{
  constructor(props){
    super(props);
    this.state = {
      message: ''
    };
  }
  componentDidMount() {
    const token = this.props.location.query.token ? this.props.location.query.token : '';
    if (token) {
      this.props.dispatch(confirmUser(this.props.location.query.token)).then((res) => {
        this.setState({ message: res.user });
      });
    }
  }
  render(){
    return (
      <div>
        {this.state.message}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}
Confirm.propTypes = {
  dispatch: PropTypes.func,
};
Confirm.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Confirm);
