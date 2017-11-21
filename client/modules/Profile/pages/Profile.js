import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { getId, getGoogleAuthentication, getGoogleSecret, getIsSubmitting, getApproved, getRealName, getPhone, getCoinList, getRequireInform } from '../../App/AppReducer';
import { googleAuth, setNotify, cancelGoogle, logout, updateProfile, setIsSubmitting, addInform, refetchUserProfile, deleteInform } from '../../App/AppActions';
import { Checkbox, Modal, Table, Button, FormGroup, HelpBlock, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import numeral from 'numeral';
import styles from '../../../main.css';

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
    this.setState({
      realName: this.props.realName,
      phone: this.props.phone,
    })
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
        this.props.dispatch(setNotify('Vui lòng nhập đầy đủ th6ong tin.'));
        return;
      }
      if (res.user === 'error') {
        this.props.dispatch(setNotify('Lỗi hủy bảo mật 2 yếu tố.'));
        return;
      }
      if (res.user === 'reject') {
        this.props.dispatch(setNotify('Mã google kh6ong đúng.'));
        return;
      }
      if (res.user === 'not found') {
        this.props.dispatch(setNotify('Mã google kh6ong đúng.'));
        return;
      }
      if (res.user === 'success') {
        this.setState({isCancelGoogle: false, token: ''});
        this.props.dispatch(setNotify('Hủy bảo mật 2 cấp thành công'));
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
    const user = {
      id: this.props.id,
      token: this.state.token,
    };
    this.props.dispatch(googleAuth(user)).then((res) => {
      if (res.user === 'success') {
        this.props.dispatch(setNotify('Kích hoạt mật mã 2 cấp thành công'));
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
        this.props.dispatch(setNotify('Lỗi thay đổi thông tin h6ò sơ.'));
        return;
      }
      if (res.profile === 'missing') {
        this.props.dispatch(setNotify('Vui lòng nhập đầy đủ thông tin.'));
        return;
      }
      if (res.profile === 'success') {
        this.props.dispatch(setIsSubmitting());
        this.props.dispatch(setNotify('Hồ sơ của bạn đang được duyệt.'));
      }
    });
  };

  addInform = () => {
    this.setState({ inform: !this.state.inform });
  };
  onCoinSelect = (eventKey) => {
    this.setState({ coin: eventKey });
  };
  handleMin = (event) => { this.setState({ min: event.target.value }); };
  handleMax = (event) => { this.setState({ max: event.target.value }); };
  onAddInform = () => {
    if (this.state.coin === 'Chọn coin') {
      this.props.dispatch(setNotify('Vui lòng chọn giá coin cần được thông báo'));
      return;
    }
    if (this.state.min >= 10 || this.state.max <= 10) {
      if (this.state.min >= 10 && this.state.min !== '') {
        this.props.dispatch(setNotify('Giá báo phải thấp hơn giá hiện tại'));
        return;
      }
      if (this.state.max <= 10 && this.state.max !== '') {
        this.props.dispatch(setNotify('Giá báo phải lớn hơn giá hiện tại'));
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
        this.props.dispatch(setNotify('Đặt báo giá thành công'));
        this.props.dispatch(refetchUserProfile(res.user));
      } else {
        this.props.dispatch(setNotify('Đặt báo giá không thành công'));
      }
    })
  };
  onDeleteInform = (informId) => {
    const inform = {
      id: this.props.id,
      informId
    };
    this.props.dispatch(deleteInform(inform)).then((res) => {
      if (res.inform === 'success') {
        this.setState({ min: 0, max: 0, coin: 'Chọn coin' });
        this.props.dispatch(setNotify('Hủy báo giá thành công'));
        this.props.dispatch(refetchUserProfile(res.user));
      } else {
        this.props.dispatch(setNotify('Hủy báo giá không thành công'));
      }
    })
  };
  render(){
    return (
      <div>
        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td style={{ width: '20%' }}>Họ tên</td>
              {
                this.props.approved ? (
                    <td style={{ width: '80%' }}>{this.props.realName}</td>
                  ) : (
                    <td style={{ width: '80%' }}>
                      <FormGroup style={{ marginBottom: '0' }} >
                        <FormControl
                          disabled={this.props.isSubmitting || this.props.approved}
                          type="text"
                          placeholder="Họ tên"
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
                          placeholder="Số điện thoại"
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
                <Button disabled={this.props.approved || this.props.isSubmitting} onClick={this.onSubmitProfile}>Gửi</Button>
              </td>
            </tr>
            <tr>
              <td>Bảo mật 2 cấp</td>
              {
                this.props.googleAuthentication ? (
                    <Button bsStyle="danger" onClick={this.onCancelGoogle}>Hủy bảo mật 2 cấp</Button>
                  ) : (
                    <Button bsStyle="warning" onClick={this.onActivateGoogle}>Kích hoạt bảo mật 2 cấp ngay</Button>
                  )
              }
            </tr>

            <tr>
              <td>Thông báo giá</td>
              <td>
                <Button bsStyle="success" onClick={this.addInform}>{this.state.inform ? '-' : '+'}</Button>
              </td>
            </tr>
            {
              this.state.inform ? (
                  <tr>
                    <td />
                    <td style={{ display: 'table' }} className={styles.profileTableDisplay}>
                      <DropdownButton title={this.state.coin} id="coin-seletec-dropdown" onSelect={this.onCoinSelect} style={{ display: 'table-cell', width: '100%' }}>
                        <MenuItem eventKey='Chọn coin'>Chọn coin</MenuItem>
                        {
                          this.props.coinList.map((coin, index) => (
                            <MenuItem key={`${index}CoinSelect`} eventKey={coin.name}>{coin.name}</MenuItem>
                          ))
                        }
                      </DropdownButton>
                      <FormControl
                        type="text"
                        value={this.state.min}
                        placeholder="khi giá nhỏ hơn"
                        onChange={this.handleMin}
                        style={{ display: 'table-cell', width: '20%' }}
                      />
                      <FormControl
                        type="text"
                        defaultValue={`Giá hiện tại 10`}
                        style={{ display: 'table-cell', width: '20%' }}
                        disabled
                      />
                      <FormControl
                        type="text"
                        value={this.state.max}
                        placeholder="khi giá lớn hơn"
                        style={{ display: 'table-cell', width: '20%' }}
                        onChange={this.handleMax}
                      />
                      <Button bsStyle="success" onClick={this.onAddInform} style={{ width: '20%' }}>Thêm</Button>
                    </td>
                  </tr>
                ) : ''
            }
            {
              (this.props.requireInform.length > 0) ? (
                  <tr>
                    <td>Các thông báo đã đặt</td>
                    <td>
                      {
                        this.props.requireInform.map((inform, index) => (
                          <div key={`${index}Inform`} style={{ height: '35px', verticalAlign: 'middle', lineHeight: '35px' }}>
                            <div style={{ display: 'inline' }}>
                              {`Bạn đã đặt báo giá khi giá ${inform.coin} ${(inform.max === 0) ? `nhỏ hơn ${inform.min}` : `lớn hơn ${inform.max}`}`}
                            </div>
                            <div style={{ display: 'inline', paddingTop: '5px', float: 'right' }}>
                            <Button bsSize="xs" bsStyle="danger" onClick={() => this.onDeleteInform(inform._id)} style={{ width: '100%' }}>Xóa</Button>
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
            <Modal.Title>Mã quét QR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img style={{ width: '100%' }} src={this.state.qrcode} />
            <FormGroup>
              <FormControl type="text" placeholder="Nhập mã bảo mật" value={this.state.token} onChange={this.handleToken} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHide}>Đóng</Button>
            <Button onClick={this.onSubmitGoogle}>Gửi</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isCancelGoogle} bsSize="sm" onHide={this.onHideCancelGoogle}>
          <Modal.Header closeButton>
            <Modal.Title>Mã quét QR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <FormControl type="text" placeholder="Nhập mã bảo mật" value={this.state.token} onChange={this.handleToken} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHideCancelGoogle}>Đóng</Button>
            <Button onClick={this.onCancelGoogleAuth}>Gửi</Button>
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
};
Profile.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Profile);
