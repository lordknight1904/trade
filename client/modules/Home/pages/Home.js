import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatButton, FontIcon } from 'material-ui';
import appStyles from '../../App/App.css';
import { Glyphicon } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div
          style={{
            backgroundImage: 'url(/image/homeBanner.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '100%',
            height: 'calc(100vh - 50px)',
            marginTop: '-20px'
          }}
        >
          <div className={appStyles.container}>
            <div>
              <h1 style={{ color: 'white', fontSize: '50px', fontWeight: 'bold' }}>
                Digital Exchange
              </h1>
              <p style={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                Nhanh chóng - An toàn - Xu hướng
              </p>
            </div>
          </div>
        </div>

        <div
          className={appStyles.column}
          style={{
            backgroundColor: '#b3d5d6',
            width: '100%',
            marginTop: '-20px',
            paddingBottom: '20px',
          }}
        >
          <div className={appStyles.container} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Glyphicon glyph="glyphicon glyphicon-flash" />
              <p style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
                Thao tác nhanh chóng
              </p>
              <p style={{ textAlign: 'center' }}>
                công nghệ web tiên tiến
              </p>
              <p style={{ textAlign: 'center' }}>
                Xử lý thời gian thực
              </p>
            </div>
            <div>
              <Glyphicon glyph="glyphicon glyphicon-modal-window" />
              <p style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
                Tăng cường bảo mật
              </p>
              <p style={{ textAlign: 'center' }}>
                với Google Authenticate
              </p>
              <p style={{ textAlign: 'center' }}>
                không thông tin cá nhân nào bị tiết lộ khi giao dịch
              </p>
            </div>
            <div>
              <Glyphicon glyph="glyphicon glyphicon-globe" />
              <p style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
                Hòa dòng thị trường
              </p>
              <p style={{ textAlign: 'center' }}>
                nắm bắt thời cơ
              </p>
              <p style={{ textAlign: 'center' }}>
                bắt kịp tỷ giá
              </p>
            </div>
          </div>
        </div>
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
