import User from '../models/user';
import Order from '../models/order';
import Setting from '../models/setting';
import Transaction from '../models/transaction';
import * as btc from '../util/btc';
import * as usdt from '../util/usdt';
import * as dash from '../util/dash';
import * as eth from '../util/eth';
import mongoose from 'mongoose';
import { ordersAndHold, updateOrderListToAll, ordersIndividualAndHold } from '../routes/socket_routes/chat_socket';
import { scanInformRequire } from './nexmoMessage';
import async from 'async';
import numeral from 'numeral';

let running = false;

function findUsers(s, b, callback) {
  async.parallel({
    userFrom: (cb) => { User.findOne({ _id: s.userId }).exec(cb); },
    userTo: (cb) => { User.findOne({ _id: b.userId }).exec(cb); }
  }, (err, result) => {
    callback(err, result.userFrom, result.userTo);
  });
}
function updateOrders(order1, order2, amount1, amount2, callback) {
  async.parallel({
    order1: (cb) => {
      Order.updateOne(
        { _id: order1._id },
        {
          amountRemain: amount1,
          stage: (amount1 > 7000) ? 'open' : 'close'
        }).exec(cb);
    },
    order2: (cb) => {
      Order.updateOne(
        { _id: order2._id },
        {
          amountRemain: amount2,
          stage: (amount2 > 7000) ? 'open' : 'close'
        }).exec(cb);
    },
  }, (err, result) => {
    callback(err, result.order1, result.order2);
  });
}
export function orderMatching(coin) {
  Order.aggregate([
    {
      $match: {
        stage: 'open',
        coin,
      },
    },
    { $sort: { price: -1, dateCreated: -1 } },
    {
      $group: {
        _id: '$type',
        order: {
          $push: {
            _id: '$_id',
            userId: '$userId',
            type: '$type',
            coin: '$coin',
            price: '$price',
            amount: '$amount',
            amountRemain: '$amountRemain',
            dateCreated: '$dateCreated',
            stage: '$stage',
          },
        },
        max: { $max: '$price' },
        min: { $min: '$price' },
      },
    },
  ]).exec((err, order) => {
    if (err) {
      // ordersAndHold({ coin: coin });
    } else {
      const arr = order.filter((o) => { return o._id === 'sell' });
      const arr2 = order.filter((o) => { return o._id === 'buy' });
      const sell = (arr.length > 0) ? arr[0].order : [];
      const buy = (arr2.length > 0) ? arr2[0].order : [];
      running = false;
      if (buy.length === 0 || sell.length === 0) {
        return;
      }
      sell.reverse();
      buy.map((b) => {
        sell.map((s) => {
          if (b.price >= s.price) {
            if (!running && b.userId.toString() !== s.userId.toString()) {
              makeTransactionOrderToOrder(s, b);
              running = true;
              return;
            }
          } else {
            return;
          }
        });
      });
    }
  });
}
export function startOrderMatching(coin, userId) {
  ordersAndHold({ coin, idFrom: userId, idTo: '' });
  if (!running) {
    orderMatching(coin);
    running = true;
  }
}
function makeTransactionOrderToOrder(s, b) {
  Setting.find((errSetting, setting) => {
    if (!errSetting) {
      let feeNetwork = setting.filter(set => { return set.name === `feeNetwork${s.coin}`; });
      let feeUsdt = setting.filter(set => { return set.name === 'feeUsdt'; });
      let feeCoin = setting.filter(set => { return set.name === `feeCoin${s.coin}`; });
      let addressCoin = setting.filter(set => { return set.name === `addressCoin${s.coin}`; });
      let api = {};
      if (feeNetwork.length === 0) return;
      if (feeUsdt.length === 0) return;
      if (feeCoin.length === 0) return;
      if (addressCoin.length === 0) return;

      const amount = (s.amountRemain <= b.amountRemain) ? s.amountRemain : b.amountRemain;
      let unit = 0;
      switch (s.coin) {
        case 'BTC': {
          api = btc;
          unit = 100000000;
          break;
        }
        case 'ETH': {
          api = eth;
          unit = 1000000000000000000;
          break;
        }
        case 'DASH': {
          api = dash;
          unit = 100000000;
          break;
        }
        default: api = {}; return;
      }
      Order.updateMany(
        {
          _id: {
            $in: [
              mongoose.Types.ObjectId(s._id),
              mongoose.Types.ObjectId(b._id),
            ],
          },
        },
        { stage: 'trading' })
        .exec((errUpdate) => {
          if (errUpdate) {
            console.log(errUpdate);
          } else {
            console.log(`khớp lệnh với giá ${b.price} ${s.price}`);
            findUsers(s, b, (err2, userFrom, userTo) => {
              if (!err2) {
                api.transactionWithFee(userFrom, userTo, s, b, addressCoin[0].value, feeCoin[0].value, feeNetwork[0].value)
                  .catch((err) => {
                    ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id });
                  })
                  .then((tx) => {
                    const amount1 = s.amountRemain - amount;
                    const amount2 = b.amountRemain - amount;
                    updateOrders(s, b, amount1, amount2, () => {
                      ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id });
                      orderMatching(s.coin);
                      const transaction = new Transaction({
                        from: userFrom._id,
                        to: userTo._id,
                        amount,
                        price: s.price,
                        feeCoin: tx.fee,
                        feeUsdt: amount / unit * numeral(b.price).value() * feeUsdt[0].value / 100,
                        coin: s.coin,
                        txCoin: tx.txHash,
                      });
                      User.updateMany(
                        { _id: { $in: [s._id, b._id] } },
                        { $push: { transactions: transaction._id } },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                      ).exec(() => {});

                      const at = userTo.addresses.filter((a) => {
                        return a.coin === b.coin;
                      });
                      const addressTo = (at.length > 0) ? at[0] : [];
                      const webhook = {
                        event: 'tx-confirmation',
                        address: addressTo.address,
                        url: `http://124753d4.ngrok.io/api/order/done/${s.coin}/${userTo.userName}/${transaction._id}`,
                        confirmations: 6
                      };
                      switch (s.coin) {
                        case 'LTC':
                        case 'BTC': {
                          api.createHook(webhook);
                          break;
                        }
                        case 'ETH': {
                          break;
                        }
                        default: break;
                      }
                      transaction.save((err) => {
                        if (err) console.log(err);
                        // scanInformRequire(s.coin);
                        ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id });
                      });
                    });
                  });
              } else {
                ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id });
              }
            });
          }
        });
    }
  });
}


export function checkInform(coin) {

}
