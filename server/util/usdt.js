import bcypher from 'blockcypher';

const usdt = new bcypher('bcy', 'test', '54f58bb28ee74b419188f503b0bf250f');

import bigi from 'bigi';

import bitcoin from 'bitcoinjs-lib';
import buffer from 'buffer';
import Order from '../models/order';

export function addressToAddressWithFee(userFrom, userTo, amount, fee, exchangeFee) {
  return new Promise((resolve) => {
    const newtx = {
      inputs: [{addresses: [userFrom.address]}],
      outputs: [
        {addresses: [userTo.address], value: Number(amount)}
      ],
      fees: Number(fee)
    };
    usdt.newTX(newtx, function(err, data) {
      if (err) {
        resolve({ code: 'error', error: err });
      } else {
        let keys = null;
        keys = new bitcoin.ECPair(bigi.fromHex(userFrom.private));
        data.pubkeys = [];
        data.signatures = data.tosign.map( function(tosign) {
          data.pubkeys.push(keys.getPublicKeyBuffer().toString('hex'));
          return keys.sign(new buffer.Buffer(tosign, 'hex')).toDER().toString('hex');
        });
        usdt.sendTX(data, function (err2, ret) {
          if (err2) {
            resolve({ code: 'error', error: err2 });
          } else {
            const webhook2 = {
              'event': 'tx-confirmation',
              'address': userTo.address,
              'url': `http://c2e8dfae.ngrok.io/api/trade/${userTo.address}`,
              confirmations: 6
            };
            usdt.createHook(webhook2, (err3, d) => {
            });
            resolve({ code: 'done' });
          }
        });
      }
    });
  });
}

export function getHash(txHash) {
  return new Promise((resolve, reject) => {
    usdt.getTX(txHash, {},(err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.confirmations);
      }
    });
  });
}
export function addAddress() {
  return new Promise((resolve, reject) => {
    usdt.genAddr({},(err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
export function faucet(address) {
  usdt.faucet(address, 500000, () => {});
}
export function getAddress(address) {
  return new Promise((resolve, reject) => {
    usdt.getAddr(address, {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
export function getHold(id) {
  return new Promise((resolve, reject) => {
    Order.find({ userId: id, type: 'buy', $or: [{ stage: 'open' }] }).exec((err, order) => {
      if (err) {
        reject(err);
      } else {
        let hold = 0;
        order.map((o) => {
          hold += o.amountRemain / 100000 * o.price;
        });
        resolve(hold);
      }
    });
  });
}
export function transactionWithFee(userFrom, userTo, orderSell, orderBuy, addressFee, feeTrade, feeNetwork) {
  return new Promise((resolve, reject) => {
    let unit = 0;
    switch (orderSell.coin) {
      case 'BTC': {
        unit = 100000000;
        break;
      }
      case 'ETH': {
        unit = 1000000000000000000;
        break;
      }
      default: unit = 100000000;
    }
    const amountCoin = (orderSell.amountRemain <= orderBuy.amountRemain) ? orderSell.amountRemain : orderBuy.amountRemain;
    const amount = (amountCoin) / unit * 100000 * orderSell.price  - feeNetwork - feeTrade;
    const amountUsdt = (feeTrade)/ 1000 * orderSell.price;
    const af = userFrom.addresses.filter((a) => {
      return a.coin === 'USDT';
    });
    const at = userTo.addresses.filter((a) => {
      return a.coin === 'USDT';
    });
    const addressFrom = (af.length > 0) ? af[0] : [];
    const addressTo = (at.length > 0) ? at[0] : [];
    if (af.length === 0 || at.length === 0) reject('addressError');
    const newtx = {
      inputs: [{addresses: [addressFrom.address]}],
      outputs: [
        {addresses: [addressTo.address], value: Number(amount)},
        {addresses: [addressFee], value: Number(amountUsdt)}
      ],
      fees: Number(feeNetwork)
    };
    usdt.newTX(newtx, function (err, data) {
      if (err) {
        reject('transactionError');
      } else {
        if (data.hasOwnProperty('errors') || data.hasOwnProperty('error')) reject('transactionError');
        let keys = null;
        keys = new bitcoin.ECPair(bigi.fromHex(addressFrom.private));
        data.pubkeys = [];
        data.signatures = data.tosign.map(function (tosign) {
          data.pubkeys.push(keys.getPublicKeyBuffer().toString('hex'));
          return keys.sign(new buffer.Buffer(tosign, 'hex')).toDER().toString('hex');
        });
        console.log(data);
        usdt.sendTX(data, function (err2, ret) {
          if (err2) {
            reject('signError');
          } else {
            // console.log(ret);
            if (ret && !ret.hasOwnProperty('error')) {
              // console.log(ret);
              const webhook2 = {
                'event': 'tx-confirmation',
                'address': addressTo.address,
                'url': `http://c2e8dfae.ngrok.io/api/trade/${addressTo.address}`,
                confirmations: 6
              };
              usdt.createHook(webhook2, () => {
              });
              resolve(ret.tx.hash);
            } else {
              reject('sendError');
            }
          }
        });
      }
    });
  });
}
