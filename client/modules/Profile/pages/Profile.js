import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { getId, getGoogleAuthentication, getGoogleSecret, getIsSubmitting, getApproved, getRealName, getPhone, getCoinList, getRequireInform } from '../../App/AppReducer';
import { googleAuth, setNotify, cancelGoogle, logout, updateProfile, setIsSubmitting, addInform, refetchUserProfile, deleteInform, setGoogleAuthentication } from '../../App/AppActions';
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
      coin: 'Select coin',
      min: '',
      max: '',

      imageSrc: '',
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
        this.props.dispatch(setGoogleAuthentication(false));
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
      this.props.dispatch(setNotify('Please input QR code.'));
      return;
    }
    const user = {
      id: this.props.id,
      token: this.state.token,
    };
    this.props.dispatch(googleAuth(user)).then((res) => {
      if (res.user === 'success') {
        this.props.dispatch(setNotify('Two factors security activated.'));
        this.props.dispatch(setGoogleAuthentication(true));
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
      imageSrc: this.state.imageSrc,
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
  };c
  onUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    let base64image = null;
    reader.onload = (readerEvt) => {
      base64image = readerEvt.target.result;
    };
    reader.onloadend = () => {
      this.setState({
        imageSrc: base64image,
      });
    };
    reader.readAsDataURL(file);
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
              <td>Phone number</td>
              {
                this.props.approved ? (
                    <td>{this.props.phone}</td>
                  ) : (
                    <td>
                      <FormGroup style={{ marginBottom: '0' }} >
                        <FormControl
                          disabled={this.props.isSubmitting || this.props.approved}
                          type="text"
                          placeholder="Phone number"
                          value={this.state.phone}
                          onChange={this.handlePhone}
                        />
                      </FormGroup>
                    </td>
                  )
              }
            </tr>
            <tr>
              <td>Identity Verification Photo</td>
              {
                this.props.approved ? (
                    <td>{this.props.phone}</td>
                  ) : (
                    <td>
                      <Button bsStyle="info" bsSize="xsmall" style={{ padding: '0' }}>
                        <label htmlFor="file-upload" style={{ padding: '5px 12px', width: '100%', height: '100%', margin: '0' }}>
                          <i className="fa fa-cloud-upload" style={{ color: 'white' }} />
                          <p style={{ margin: '0', paddingLeft: '5px', display: 'inline-block' }}>Upload</p>
                        </label>
                      </Button>
                      <input id="file-upload" accept="image/jpeg, image/png" type="file" style={{ display: 'none' }}  onChange={this.onUpload}/>
                      <br/>
                      {
                        (this.state.imageSrc !== '') ? (
                          <img width={200} height={150} src={this.state.imageSrc}/>
                        ) : ''
                      }
                    </td>
                  )
              }
            </tr>

            {
              !this.props.approved ? (
                  <tr>
                    <td colSpan="2">
                      <Button bsStyle="primary" bsSize="small" disabled={this.props.approved || this.props.isSubmitting}
                              onClick={this.onSubmitProfile}>Submit</Button>
                    </td>
                  </tr>
                ) : <tr />
            }
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
