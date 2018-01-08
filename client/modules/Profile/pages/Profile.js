import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { getId, getGoogleAuthentication, getGoogleSecret, getIsSubmitting, getApproved, getRealName, getPhone, getCoinList, getRequireInform } from '../../App/AppReducer';
import { googleAuth, setNotify, cancelGoogle, logout, updateProfile, setIsSubmitting, addInform, refetchUserProfile, deleteInform } from '../../App/AppActions';
import { Checkbox, Modal, Table, Button, FormGroup, HelpBlock, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import numeral from 'numeral';
import { getRate } from '../../Exchange/ExchangeReducer'
import { fetchRate } from '../../Exchange/ExchangeActions'
import appStyles from '../../App/App.css';

class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      qrcode: '',
      isGoogle: false,
      token: '',
      isCancelGoogle: false,

      realName: '',
      phone: '',

      inform: '',
      coin: 'Chọn coin',
      min: '',
      max: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.id === '') {
      this.context.router.push('/');
    }
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    } else {
    }
  }
  componentDidMount() {
    this.props.coinList.map((cl) => {
      if (cl.name !== 'USDT') {
        this.props.dispatch(fetchRate(cl.name));
      }
    });
    this.setState({
      realName: this.props.realName,
      phone: this.props.phone,
    });
  }
  onActivateGoogle = () => {
    this.setState({ isGoogle: true });
    QRCode.toDataURL(this.props.googleSecret.otpauth_url, (err, qrcode) => {
      if (err) {
        console.log(err)
      } else {
        this.setState({ qrcode });
      }
    });
  };
  onHide = () => {
    this.setState({ isGoogle: false });
  };
  onCancelGoogleAuth = () => {
    const user = {
      id: this.props.id,
      token: this.state.token,
    };
    this.props.dispatch(cancelGoogle(user)).then((res) => {
      if (res.user === 'missing') {
        this.props.dispatch(setNotify('Please provide information adequately.'));
        return;
      }
      if (res.user === 'error') {
        this.props.dispatch(setNotify('Two factors error.'));
        return;
      }
      if (res.user === 'reject') {
        this.props.dispatch(setNotify('Google Authenticator code incorrect.'));
        return;
      }
      if (res.user === 'not found') {
        this.props.dispatch(setNotify('Google Authenticator code incorrect.'));
        return;
      }
      if (res.user === 'success') {
        this.setState({isCancelGoogle: false, token: ''});
        this.props.dispatch(setNotify('Cancel two factors security success.'));
        this.props.dispatch(logout());
      }
    });
  };
  handleToken = (event) => {
    this.setState({ token: event.target.value.trim() });
  };
  onCancelGoogle = () => {
    this.setState({ isCancelGoogle: true });
  };
  onHideCancelGoogle = () => {
    this.setState({ isCancelGoogle: false });
  };
  onSubmitGoogle = () => {
    if (this.state.token === '') {
      this.props.dispatch(setNotify('Please inpu QR code.'));
      return;
    }
    const user = {
      id: this.props.id,
      token: this.state.token,
    };
    this.props.dispatch(googleAuth(user)).then((res) => {
      if (res.user === 'success') {
        this.props.dispatch(setNotify('Two factors security activated.'));
        this.setState({ isGoogle: false, token: '' });
      } else {
        this.props.dispatch(setNotify(res.user));
      }
    });
  };
  handleRealName = (event) => { this.setState({ realName: event.target.value }); };
  handlePhone = (event) => { this.setState({ phone: event.target.value }); };
  onSubmitProfile = () => {
    const profile = {
      id: this.props.id,
      realName: this.state.realName,
      phone: this.state.phone,
    };
    this.props.dispatch(updateProfile(profile)).then((res) => {
      if (res.profile === 'error') {
        this.props.dispatch(setNotify('Profile modification failed.'));
        return;
      }
      if (res.profile === 'missing') {
        this.props.dispatch(setNotify('Please provide information adequately.'));
        return;
      }
      if (res.profile === 'success') {
        this.props.dispatch(setIsSubmitting());
        this.props.dispatch(setNotify('Your profile is being processed.'));
      }
    });
  };

  addInform = () => {
    if (this.state.phone === '') {
      this.props.dispatch(setNotify('Please provide security information.'));
      return;
    }
    if (!this.props.approved) {
      this.props.dispatch(setNotify('Please wait while security profile is being processed.'));
      return;
    }
    this.setState({ inform: !this.state.inform });
  };
  onCoinSelect = (eventKey) => {
    this.setState({ coin: eventKey });
  };
  handleMin = (event) => { this.setState({ min: event.target.value }); };
  handleMax = (event) => { this.setState({ max: event.target.value }); };
  onAddInform = () => {
    if (this.state.coin === 'Chọn coin') {
      this.props.dispatch(setNotify('Please select coin for price notification.'));
      return;
    }
    if (this.state.min >= Number(this.props.rate[this.state.coin]) || this.state.max <= Number(this.props.rate[this.state.coin])) {
      if (this.state.min >= Number(this.props.rate[this.state.coin]) && this.state.min !== '') {
        this.props.dispatch(setNotify('Notify price must be lower than current price.'));
        return;
      }
      if (this.state.max <= Number(this.props.rate[this.state.coin]) && this.state.max !== '') {
        this.props.dispatch(setNotify('Notify price must be greater than current price.'));
        return;
      }
    }
    const inform = {
      id: this.props.id,
      coin: this.state.coin,
      min: Number(this.state.min),
      max: Number(this.state.max),
    };
    this.props.dispatch(addInform(inform)).then((res) => {
      if (res.inform === 'success') {
        this.setState({ min: '', max: '', coin: 'Chọn coin' });
        this.props.dispatch(setNotify('Price notification placed.'));
        this.props.dispatch(refetchUserProfile(res.user));
      } else {
        this.props.dispatch(setNotify('Price notification failed.'));
      }
    })
  };
  onDeleteInform = (informId) => {
    const inform = {
      id: this.props.id,
      informId,
    };
    this.props.dispatch(deleteInform(inform)).then((res) => {
      if (res.inform === 'success') {
        this.setState({ min: 0, max: 0, coin: 'Chọn coin' });
        this.props.dispatch(setNotify('Price notification canceled.'));
        this.props.dispatch(refetchUserProfile(res.user));
      } else {
        this.props.dispatch(setNotify('Price notification failed.'));
      }
    });
  };
  render() {
    return (
      <div className={appStyles.container} style={{ marginTop: '-50px' }}>
        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td style={{ width: '20%' }}>Full name</td>
              {
                this.props.approved ? (
                    <td style={{ width: '80%' }}>{this.props.realName}</td>
                  ) : (
                    <td style={{ width: '80%' }}>
                      <FormGroup style={{ marginBottom: '0' }} >
                        <FormControl
                          disabled={this.props.isSubmitting || this.props.approved}
                          type="text"
                          placeholder="Full name"
                          value={this.state.realName}
                          onChange={this.handleRealName}
                        />
                      </FormGroup>
                    </td>
                  )
              }
            </tr>
            <tr>
              <td>Số điện thoại</td>
              {
                this.props.approved ? (
                    <td>{this.props.phone}</td>
                  ) : (
                    <td>
                      <FormGroup style={{ marginBottom: '0' }} >
                        <FormControl
                          disabled={this.props.isSubmitting || this.props.approved}
                          type="text"
                          placeholder="Phoen number"
                          value={this.state.phone}
                          onChange={this.handlePhone}
                        />
                      </FormGroup>
                    </td>
                  )
              }
            </tr>
            <tr>
              <td colSpan="2">
                <Button bsStyle="primary" bsSize="small" disabled={this.props.approved || this.props.isSubmitting} onClick={this.onSubmitProfile}>Submit</Button>
              </td>
            </tr>
            <tr>
              <td>Two factors security</td>
              <td>
              {
                this.props.googleAuthentication ? (
                    <Button bsStyle="danger" bsSize="xsmall"  onClick={this.onCancelGoogle}>Cancel two factors security</Button>
                  ) : (
                    <Button bsStyle="warning" bsSize="xsmall"  onClick={this.onActivateGoogle}>Activate two factors security</Button>
                  )
              }
              </td>
            </tr>

            <tr>
              <td>Price notification</td>
              <td>
                <Button bsStyle="success" bsSize="xsmall" onClick={this.addInform}>{this.state.inform ? '-' : '+'}</Button>
              </td>
            </tr>
            {
              this.state.inform ? (
                  <tr>
                    <td />
                    <td style={{ display: 'table' }} className={appStyles.profileTableDisplay}>
                      <DropdownButton title={this.state.coin} id="coin-seletec-dropdown" onSelect={this.onCoinSelect} style={{ display: 'table-cell', width: '100%' }}>
                        <MenuItem eventKey='Chọn coin'>Coin</MenuItem>
                        {
                          this.props.coinList.map((coin, index) => (
                            <MenuItem key={`${index}CoinSelect`} eventKey={coin.name}>{coin.name}</MenuItem>
                          ))
                        }
                      </DropdownButton>
                      <FormControl
                        type="text"
                        value={this.state.min}
                        placeholder="lower"
                        onChange={this.handleMin}
                        style={{ display: 'table-cell', width: '20%' }}
                      />
                      <FormControl
                        type="text"
                        value={`Current price ${this.props.rate[this.state.coin] ? numeral(this.props.rate[this.state.coin].price).format('0,0') : '~'}`}
                        style={{ display: 'table-cell', width: '20%' }}
                        disabled
                      />
                      <FormControl
                        type="text"
                        value={this.state.max}
                        placeholder="greater"
                        style={{ display: 'table-cell', width: '20%' }}
                        onChange={this.handleMax}
                      />
                      <Button bsStyle="success" onClick={this.onAddInform} style={{ width: '20%' }}>Add</Button>
                    </td>
                  </tr>
                ) : ''
            }
            {
              (this.props.requireInform.length > 0) ? (
                  <tr>
                    <td>Price notifications</td>
                    <td>
                      {
                        this.props.requireInform.map((inform, index) => (
                          <div key={`${index}Inform`} style={{ height: '35px', verticalAlign: 'middle', lineHeight: '35px' }}>
                            <div style={{ display: 'inline' }}>
                              {`Notify when ${inform.coin} ${(inform.max === 0) ? `lower than ${inform.min}` : `greater than ${inform.max}`}`}
                            </div>
                            <div style={{ display: 'inline', paddingTop: '5px', float: 'right' }}>
                            <Button bsSize="xs" bsStyle="danger" onClick={() => this.onDeleteInform(inform._id)} style={{ width: '100%' }}>Delete</Button>
                            </div>
                          </div>
                        ))
                      }
                    </td>
                  </tr>
                ) : ''
            }
          </tbody>
        </Table>

        <Modal show={this.state.isGoogle} bsSize="sm" onHide={this.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>QR code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img style={{ width: '100%' }} src={this.state.qrcode} />
            <FormGroup>
              <FormControl type="text" placeholder="Security Code" value={this.state.token} onChange={this.handleToken} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" bsSize="small" onClick={this.onHide}>Close</Button>
            <Button bsStyle="primary" bsSize="small" onClick={this.onSubmitGoogle}>Submit</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isCancelGoogle} bsSize="sm" onHide={this.onHideCancelGoogle}>
          <Modal.Header closeButton>
            <Modal.Title>QR code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <FormControl type="text" placeholder="Security Code" value={this.state.token} onChange={this.handleToken} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" bsSize="small" onClick={this.onHideCancelGoogle}>Close</Button>
            <Button bsStyle="primary" bsSize="small" onClick={this.onCancelGoogleAuth}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    id: getId(state),
    googleAuthentication: getGoogleAuthentication(state),
    googleSecret: getGoogleSecret(state),
    approved: getApproved(state),
    isSubmitting: getIsSubmitting(state),
    realName: getRealName(state),
    phone: getPhone(state),
    coinList: getCoinList(state),
    requireInform: getRequireInform(state),
    rate: getRate(state),
  };
}
Profile.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  googleAuthentication: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  approved: PropTypes.bool.isRequired,
  realName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  googleSecret: PropTypes.object.isRequired,
  coinList: PropTypes.array.isRequired,
  requireInform: PropTypes.array.isRequired,
  rate: PropTypes.object.isRequired,
};
Profile.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Profile);
