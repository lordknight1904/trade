import User from '../models/user';
import Order from '../models/order';
import Setting from '../models/setting';
import Transaction from '../models/transaction';
import * as btc from '../util/btc';
import * as usdt from '../util/usdt';
import mongoose from 'mongoose';
import { ordersAndHold, updateOrderListToAll, ordersIndividualAndHold } from '../routes/socket_routes/chat_socket';
let running = false;

export function startOrderMatching(coin, userId) {
  ordersAndHold({ coin: coin, idFrom: userId, idTo: '' });
  if (!running) {
    orderMatching(coin);
    running = true;
  }
}
function makeTransactionOrderToOrder(s, b) {
  Setting.find((errSetting, setting) => {
    if (errSetting) {

    } else {
      const feeNetworkArr = setting.filter(s => {return s.name === 'feeNetwork';});
      if (feeNetworkArr.length === 0) return;

      const feeBTCArr = setting.filter(s => {return s.name === 'feeBTC';});
      if (feeBTCArr.length === 0) return;
      const feeETHArr = setting.filter(s => {return s.name === 'feeETH';});
      if (feeETHArr.length === 0) return;
      const feeUSDTArr = setting.filter(s => {return s.name === 'feeUSDT';});
      if (feeETHArr.length === 0) return;

      const addressBTCArr = setting.filter(s => {return s.name === 'addressBTC';});
      if (addressBTCArr.length === 0) return;
      const addressETHArr = setting.filter(s => {return s.name === 'addressETH';});
      if (addressETHArr.length === 0) return;
      const addressUSDTArr = setting.filter(s => {return s.name === 'addressUSDT';});
      if (addressUSDTArr.length === 0) return;

      const feeBTC = Number(feeBTCArr[0].value);
      const feeETH = Number(feeETHArr[0].value);
      const feeUSDT = Number(feeUSDTArr[0].value);
      const feeNetwork = Number(feeNetworkArr[0].value);

      const addressBTC = addressBTCArr[0].value;
      const addressETH = addressETHArr[0].value;
      const addressUSDT = addressUSDTArr[0].value;

      const feeCoin = feeBTC;
      const addressCoin = addressBTC;

      Order.updateMany(
        {
          _id: {
            $in: [
              mongoose.Types.ObjectId(s._id),
              mongoose.Types.ObjectId(b._id)
            ]
          },
        },
        { stage: 'trading' })
        .exec((errUpdate) => {
          if (errUpdate) {
          } else {
            console.log(`khớp lệnh với giá ${b.price} ${s.price}`);
            User.findOne({ _id: s.userId }).exec((err, userFrom) => {
              if (err) {}
              else {
                if (userFrom) {
                  User.findOne({_id: b.userId}).exec((err2, userTo) => {
                    if (err2) ordersAndHold({ coin: b.coin, idFrom: userFrom._id, idTo: userTo._id  });
                    else {
                      if (userTo) {
                        // phi cho network la 0.0005 / 50000
                        const amount = (s.amountRemain <= b.amountRemain) ? s.amountRemain : b.amountRemain;
                        btc.transactionWithFee(userFrom, userTo, s, b, addressCoin, feeCoin, feeNetwork).catch(() => {
                          ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id  });
                        }).then((txCoin) => {
                          usdt.transactionWithFee(userTo, userFrom, s, b, addressUSDT, feeUSDT, feeNetwork).catch(() => {
                            ordersAndHold({ coin: b.coin, idFrom: userFrom._id, idTo: userTo._id  });
                          }).then((txUsdt) => {
                            Order.updateMany({ _id: { $in: [ s._id, b._id ] } }, { $inc: { amountRemain:  (0 - amount)} }).exec((err3) => {
                              if (err3) {
                                ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id  });
                              } else {
                                Order.updateMany(
                                  {
                                    _id: {
                                      $in: [
                                        mongoose.Types.ObjectId(s._id),
                                        mongoose.Types.ObjectId(b._id)
                                      ]
                                    },
                                    amountRemain: { $lte: 200000 },
                                  },
                                  { stage: 'close' })
                                  .exec((err4) => {
                                    if (err4) {
                                      ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id  });
                                    } else {
                                      Order.updateMany(
                                        {
                                          _id: {
                                            $in: [
                                              mongoose.Types.ObjectId(s._id),
                                              mongoose.Types.ObjectId(b._id)
                                            ]
                                          },
                                          amountRemain: { $gt: 200000 },
                                          stage: 'trading'
                                        },
                                        { stage: 'open' })
                                        .exec((err5) => {
                                          if (err5) {
                                            ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id  });
                                          } else {
                                            orderMatching(s.coin);
                                            const transaction = new Transaction({
                                              from: userFrom._id,
                                              to: userTo._id,
                                              amount,
                                              price: s.price,
                                              feeCoin,
                                              feeUsdt: feeUSDT,
                                              coin: s.coin,
                                              txCoin,
                                              txUsdt,
                                            });
                                            User.updateMany(
                                              {
                                                _id: {
                                                  $in: [
                                                    mongoose.Types.ObjectId(userFrom._id),
                                                    mongoose.Types.ObjectId(userTo._id)
                                                  ]
                                                },
                                              },
                                              { $push: { transactions: transaction._id} },
                                              { upsert: true, new: true, setDefaultsOnInsert: true }
                                            ).exec(() => {});
                                            transaction.save(() => {
                                              ordersAndHold({ coin: s.coin, idFrom: userFrom._id, idTo: userTo._id  });
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          });
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        })
    }
  });
}
export function orderMatching(coin) {
  Order.aggregate([
    {
      $match: {
        stage: 'open',
        coin: coin,
        amountRemain: { $gte: 100 },
      },
    },
    { $sort: { 'price': -1, 'dateCreated': -1 } },
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
          }
        },
        max: { $max: '$price' },
        min: { $min: '$price' }
      }
    },
  ]).exec((err, order) => {
    if (err) {
      // ordersAndHold({ coin: coin });
    } else {
      const arr = order.filter((o) => { return o._id === 'sell'});
      const arr2 = order.filter((o) => { return o._id === 'buy'});
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
            if (b.userId !== s.userId) {
              makeTransactionOrderToOrder(s, b);
              running = true;
            }
          } else {
            return;
          }
        });
      });
    }
  });
}
