import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AmCharts from '@amcharts/amcharts3-react';
import styles from './Amchart.css';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
    this.timer = null;
  }
  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    const config = {
      type: 'serial',
      theme: 'light',
      marginRight: 40,
      marginLeft: 40,
      autoMarginOffset: 20,
      mouseWheelZoomEnabled: true,
      // valueAxes: [{
      //   id: "v1",
      //   axisAlpha: 0,
      //   position: "left",
      //   ignoreAxisWidth: true
      // }],
      // balloon: {
      //   borderThickness: 1,
      //   shadowAlpha: 0
      // },
      graphs: [
        {
          id: 'bids',
          fillAlphas: 0.1,
          lineAlpha: 1,
          lineThickness: 2,
          lineColor: '#0f0',
          type: 'step',
          valueField: 'bidstotalvolume',
        },
        {
          id: 'asks',
          fillAlphas: 0.1,
          lineAlpha: 1,
          lineThickness: 2,
          lineColor: '#f00',
          type: 'step',
          valueField: 'askstotalvolume',
        },
        {
          lineAlpha: 0,
          fillAlphas: 0.2,
          lineColor: '#000',
          type: 'column',
          clustered: false,
          valueField: 'bidsvolume',
        },
        {
          lineAlpha: 0,
          fillAlphas: 0.2,
          lineColor: '#000',
          type: 'column',
          clustered: false,
          valueField: 'asksvolume',
          showBalloon: false,
        },
      ],
      categoryField: 'value',
      chartCursor: {},
      balloon: {
        textAlign: 'left',
      },
      valueAxes: [{
        title: 'Volume',
      }],
      categoryAxis: {
        title: 'Price (BTC/USDT)',
        minHorizontalGap: 100,
        startOnAxis: true,
        showFirstLabel: false,
        showLastLabel: false,
      },
      dataProvider: [
        {
          value: 0.06193086,
          bidsvolume: 0.24137085,
          bidstotalvolume: 375.80134994000014
        },
        {
          value: 0.06193087,
          bidsvolume: 0.00226849,
          bidstotalvolume: 375.5599790900001
        },
        {
          value: 0.0619344,
          bidsvolume: 0.02,
          bidstotalvolume: 375.5577106000001
        },
        {
          value: 0.06193441,
          bidsvolume: 0.00355215,
          bidstotalvolume: 375.53771060000014
        },
        {
          value: 0.06195277,
          bidsvolume: 0.80706629,
          bidstotalvolume: 375.5341584500001
        },
        {
          value: 0.06195842,
          bidsvolume: 0.0300203,
          bidstotalvolume: 374.7270921600001
        },
        {
          value: 0.06195845,
          bidsvolume: 0.29405326,
          bidstotalvolume: 374.6970718600001
        },
        {
          value: 0.06196225,
          bidsvolume: 0.04034715,
          bidstotalvolume: 374.4030186000001
        },
        {
          value: 0.06196397,
          bidsvolume: 3.79440046,
          bidstotalvolume: 374.3626714500001
        },
        {
          value: 0.06196494,
          bidsvolume: 0.02156528,
          bidstotalvolume: 370.5682709900001
        },
        {
          value: 0.0619655,
          bidsvolume: 8.01610007,
          bidstotalvolume: 370.5467057100001
        },
        {
          value: 0.06196847,
          bidsvolume: 45.0777,
          bidstotalvolume: 362.5306056400001
        },
        {
          value: 0.06197083,
          bidsvolume: 0.64546497,
          bidstotalvolume: 317.4529056400001
        },
        {
          value: 0.0619738,
          bidsvolume: 0.16135851,
          bidstotalvolume: 316.8074406700001
        },
        {
          value: 0.06197695,
          bidsvolume: 16.8315,
          bidstotalvolume: 316.6460821600001
        },
        {
          value: 0.06198277,
          bidsvolume: 0.13543109,
          bidstotalvolume: 299.8145821600001
        },
        {
          value: 0.0619901,
          bidsvolume: 0.09320843,
          bidstotalvolume: 299.6791510700001
        },
        {
          value: 0.0619956,
          bidsvolume: 0.00957668,
          bidstotalvolume: 299.5859426400001
        },
        {
          value: 0.06199998,
          bidsvolume: 0.1699896,
          bidstotalvolume: 299.5763659600001
        },
        {
          value: 0.062,
          bidsvolume: 4.91841597,
          bidstotalvolume: 299.4063763600001
        },
        {
          value: 0.06200919,
          bidsvolume: 0.58345864,
          bidstotalvolume: 294.48796039000007
        },
        {
          value: 0.06200938,
          bidsvolume: 19.99987485,
          bidstotalvolume: 293.90450175000007
        },
        {
          value: 0.06201,
          bidsvolume: 1.60982422,
          bidstotalvolume: 273.90462690000004
        },
        {
          value: 0.06202945,
          bidsvolume: 0.00868924,
          bidstotalvolume: 272.29480268000003
        },
        {
          value: 0.06206662,
          bidsvolume: 23.4713909,
          bidstotalvolume: 272.28611344
        },
        {
          value: 0.0621021,
          bidsvolume: 0.95657,
          bidstotalvolume: 248.81472254
        },
        {
          value: 0.062108,
          bidsvolume: 0.00501754,
          bidstotalvolume: 247.85815254
        },
        {
          value: 0.0621138,
          bidsvolume: 0.9091,
          bidstotalvolume: 247.85313499999998
        },
        {
          value: 0.0621155,
          bidsvolume: 0.98719,
          bidstotalvolume: 246.94403499999999
        },
        {
          value: 0.062122,
          bidsvolume: 0.90784,
          bidstotalvolume: 245.956845
        },
        {
          value: 0.06212201,
          bidsvolume: 53.386,
          bidstotalvolume: 245.049005
        },
        {
          value: 0.06212202,
          bidsvolume: 79.08538295,
          bidstotalvolume: 191.663005
        },
        {
          value: 0.0621282,
          bidsvolume: 0.94283,
          bidstotalvolume: 112.57762205
        },
        {
          value: 0.06213145,
          bidsvolume: 0.01916807,
          bidstotalvolume: 111.63479205
        },
        {
          value: 0.0621345,
          bidsvolume: 0.90332,
          bidstotalvolume: 111.61562398
        },
        {
          value: 0.0621534,
          bidsvolume: 0.98463,
          bidstotalvolume: 110.71230398
        },
        {
          value: 0.0621651,
          bidsvolume: 0.91281,
          bidstotalvolume: 109.72767398
        },
        {
          value: 0.0621742,
          bidsvolume: 0.91904,
          bidstotalvolume: 108.81486398000001
        },
        {
          value: 0.06217617,
          bidsvolume: 4.6272,
          bidstotalvolume: 107.89582398000002
        },
        {
          value: 0.0621816,
          bidsvolume: 0.99196,
          bidstotalvolume: 103.26862398000002
        },
        {
          value: 0.0622169,
          bidsvolume: 0.00358525,
          bidstotalvolume: 102.27666398000001
        },
        {
          value: 0.06222083,
          bidsvolume: 2.9925,
          bidstotalvolume: 102.27307873000001
        },
        {
          value: 0.0623004,
          bidsvolume: 0.44101053,
          bidstotalvolume: 99.28057873
        },
        {
          value: 0.06230501,
          bidsvolume: 0.00273428,
          bidstotalvolume: 98.8395682
        },
        {
          value: 0.06235,
          bidsvolume: 17.8862,
          bidstotalvolume: 98.83683392
        },
        {
          value: 0.062365,
          bidsvolume: 55.84770016,
          bidstotalvolume: 80.95063392
        },
        {
          value: 0.06236501,
          bidsvolume: 12.21187595,
          bidstotalvolume: 25.10293376
        },
        {
          value: 0.06236571,
          bidsvolume: 0.03036161,
          bidstotalvolume: 12.89105781
        },
        {
          value: 0.06236645,
          bidsvolume: 4.20329856,
          bidstotalvolume: 12.8606962
        },
        {
          value: 0.06236647,
          bidsvolume: 8.65739764,
          bidstotalvolume: 8.65739764
        },
        {
          value: 0.0623852,
          asksvolume: 0.67960042,
          askstotalvolume: 0.67960042
        },
        {
          value: 0.062425,
          asksvolume: 17.867,
          askstotalvolume: 18.54660042
        },
        {
          value: 0.06242998,
          asksvolume: 0.7373971,
          askstotalvolume: 19.28399752
        },
        {
          value: 0.06243457,
          asksvolume: 5.09,
          askstotalvolume: 24.37399752
        },
        {
          value: 0.0624381,
          asksvolume: 0.90776,
          askstotalvolume: 25.28175752
        },
        {
          value: 0.062448,
          asksvolume: 0.91725,
          askstotalvolume: 26.19900752
        },
        {
          value: 0.0624516,
          asksvolume: 0.96115,
          askstotalvolume: 27.16015752
        },
        {
          value: 0.0624627,
          asksvolume: 0.97184,
          askstotalvolume: 28.13199752
        },
        {
          value: 0.0624679,
          asksvolume: 0.97867,
          askstotalvolume: 29.11066752
        },
        {
          value: 0.0624807,
          asksvolume: 0.96593,
          askstotalvolume: 30.07659752
        },
        {
          value: 0.06248331,
          asksvolume: 3.83,
          askstotalvolume: 33.90659752
        },
        {
          value: 0.0624887,
          asksvolume: 0.92405,
          askstotalvolume: 34.83064752
        },
        {
          value: 0.06249591,
          asksvolume: 11.4517219,
          askstotalvolume: 46.28236942
        },
        {
          value: 0.06249593,
          asksvolume: 0.07183415,
          askstotalvolume: 46.35420357
        },
        {
          value: 0.0625,
          asksvolume: 1.52145936,
          askstotalvolume: 47.875662930000004
        },
        {
          value: 0.06250226,
          asksvolume: 0.03026051,
          askstotalvolume: 47.90592344
        },
        {
          value: 0.0625149,
          asksvolume: 4.3793,
          askstotalvolume: 52.28522344
        },
        {
          value: 0.06252608,
          asksvolume: 0.00675176,
          askstotalvolume: 52.2919752
        },
        {
          value: 0.06253504,
          asksvolume: 7.01,
          askstotalvolume: 59.3019752
        },
        {
          value: 0.062568,
          asksvolume: 4,
          askstotalvolume: 63.3019752
        },
        {
          value: 0.06256873,
          asksvolume: 8.0216381,
          askstotalvolume: 71.3236133
        },
        {
          value: 0.0625713,
          asksvolume: 0.0343959,
          askstotalvolume: 71.35800920000001
        },
        {
          value: 0.0625778,
          asksvolume: 0.41225471,
          askstotalvolume: 71.77026391000001
        },
        {
          value: 0.06258317,
          asksvolume: 0.00788343,
          askstotalvolume: 71.77814734000002
        },
        {
          value: 0.0625861,
          asksvolume: 0.00358256,
          askstotalvolume: 71.78172990000002
        },
        {
          value: 0.06259142,
          asksvolume: 0.00203007,
          askstotalvolume: 71.78375997000002
        },
        {
          value: 0.06259948,
          asksvolume: 0.08386651,
          askstotalvolume: 71.86762648000001
        },
        {
          value: 0.0625995,
          asksvolume: 0.16533678,
          askstotalvolume: 72.03296326000002
        },
        {
          value: 0.0626,
          asksvolume: 2.9955,
          askstotalvolume: 75.02846326000002
        },
        {
          value: 0.06261487,
          asksvolume: 0.03177353,
          askstotalvolume: 75.06023679000002
        },
        {
          value: 0.06263491,
          asksvolume: 0.00769603,
          askstotalvolume: 75.06793282000002
        },
        {
          value: 0.06263745,
          asksvolume: 10,
          askstotalvolume: 85.06793282000002
        },
        {
          value: 0.06263748,
          asksvolume: 0.02066933,
          askstotalvolume: 85.08860215000003
        },
        {
          value: 0.06265599,
          asksvolume: 68.0491304,
          askstotalvolume: 153.13773255
        },
        {
          value: 0.062656,
          asksvolume: 49.87,
          askstotalvolume: 203.00773255000001
        },
        {
          value: 0.06265655,
          asksvolume: 0.06392741,
          askstotalvolume: 203.07165996
        },
        {
          value: 0.06266713,
          asksvolume: 3.00691289,
          askstotalvolume: 206.07857285
        },
        {
          value: 0.06266924,
          asksvolume: 0.00515,
          askstotalvolume: 206.08372285
        },
        {
          value: 0.06267007,
          asksvolume: 14.4958,
          askstotalvolume: 220.57952285
        },
        {
          value: 0.0626748,
          asksvolume: 0.01713209,
          askstotalvolume: 220.59665493999998
        },
        {
          value: 0.06267984,
          asksvolume: 0.63816372,
          askstotalvolume: 221.23481865999997
        },
        {
          value: 0.06269055,
          asksvolume: 0.45348018,
          askstotalvolume: 221.68829884
        },
        {
          value: 0.06270834,
          asksvolume: 0.0082776,
          askstotalvolume: 221.69657644
        },
        {
          value: 0.06270888,
          asksvolume: 0.09187594,
          askstotalvolume: 221.78845238
        },
        {
          value: 0.0627089,
          asksvolume: 0.00360016,
          askstotalvolume: 221.79205254
        },
        {
          value: 0.06271555,
          asksvolume: 0.00866758,
          askstotalvolume: 221.80072012
        },
        {
          value: 0.06271744,
          asksvolume: 0.00841733,
          askstotalvolume: 221.80913744999998
        },
        {
          value: 0.06273373,
          asksvolume: 0.14041797,
          askstotalvolume: 221.94955541999997
        },
        {
          value: 0.06273391,
          asksvolume: 0.02252351,
          askstotalvolume: 221.97207892999998
        },
        {
          value: 0.06273392,
          asksvolume: 0.03336221,
          askstotalvolume: 222.00544114
        }
      ]
    };
    return (
      <div className={styles.App} style={{ backgroundColor: '#3a444d' }}>
        {
          this.state.mounted ? (
            <AmCharts.React style={{ width: '100%', height: '340px' }} options={config} />
          ) : 'fucked'
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}
Chart.propTypes = {
  dispatch: PropTypes.func,
};
Chart.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Chart);
