
import * as btc from '../util/btc';

export function trade(req, res) {
  const userFrom = {
    private: '524f66c7f6450340cb0fc5f84d97a0e4f7242ba2f70db370196328a150d00c4b',
    public: '02bdb5489529cab97acf24021893c2984151cd07a8b0c04e06dc950a323578a19b',
    address: 'mpLHTrWn9Z1GL2tjs39ZvJPY7PjCWs1gbA',
    wif: 'cQLhfEzc6j6iNqbpd3gvrwbAt1SbBE5MyGcWGQEgfSiZq9AQU6FC'
  };
  const userTo = {
    private: '9e6efdc44310abd0812d18dc7e42fda576fc61df39340d9f9e9c278ca08e1945',
    public: '035d24c8371e60799d324470fcffd218433e0411735b968913da1b2a0527d0f2fe',
    address: 'mhjLxDyvQn3PaGGAAsU18zwvdtJkDhmVgc',
    wif: 'cStg9ZuHWbk6m7uCPV8UpwEmSurz5Kx52uk48Dh4VBWFKuKfWTko'
  };
  btc.addressToAddressWithFee(userFrom, userTo, 100000, 50000, 20000).then((result) => {
    console.log(result);
    res.json({ done: 'done' });
  });
};
export function webHook(req, res) {
  console.log('call back');
  console.log(req.params.address);
  console.log(req.body);
}
