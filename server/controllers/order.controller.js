import Order from '../models/order';
import User from '../models/user';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';
import { ordersAndHold, updateOrderListToAll, ordersIndividualAndHold } from '../routes/socket_routes/chat_socket';
import * as btc from '../util/btc';
import * as usdt from '../util/usdt';
import * as eth from '../util/eth';
import { startOrderMatching } from '../util/orderMatching';

export function createOrder(req, res) {
  const reqOrder = req.body.order;
  if (reqOrder &&
    reqOrder.hasOwnProperty('userId') &&
    reqOrder.hasOwnProperty('type') &&
    reqOrder.hasOwnProperty('coin') &&
    reqOrder.hasOwnProperty('price') && Number(reqOrder.price) > 0 &&
    reqOrder.hasOwnProperty('amount') && Number(reqOrder.amount) > 0) {
    if (reqOrder.hasOwnProperty('amount') && Number(reqOrder.amount) < 200000) {
      res.json({ order: 'Số lượng quá nhỏ' });
      return;
    }
    User.findOne({ _id: reqOrder.userId }).exec((err, user) => {
      if (err) {
        res.json({ order: 'Không thể đặt lệnh' });
      } else {
        let unit = 0;
        let api = {};
        switch (reqOrder.coin) {
          case 'BTC': {
            unit = 100000000;
            api = btc;
            break;
          }
          case 'ETH': {
            unit = 1000000000000000000;
            api = eth;
            break;
          }
          default: unit = 100000000;
        }
        if (user) {
          const newOrder = new Order({
            userId: sanitizeHtml(reqOrder.userId),
            type: sanitizeHtml(reqOrder.type),
            coin: sanitizeHtml(reqOrder.coin),
            price: sanitizeHtml(reqOrder.price),
            amount: sanitizeHtml(reqOrder.amount),
            amountRemain: sanitizeHtml(reqOrder.amount),
          });
          if (reqOrder.type === 'sell') {
            //dat lenh cho` ban BTC, kiem tra so du coin
            const address = user.addresses.filter((a) => {
              return a.coin === sanitizeHtml(reqOrder.coin);
            });
            if (address.length > 0) {
              api.getAddress(address[0].address).catch(() => {
                res.json({order: 'Không thể đặt lệnh'});
              }).then((data) => {
                api.getHold(user._id)
                .catch(() => {
                  res.json({order: 'Không thể đặt lệnh'});
                })
                .then((hold) => {
                  console.log(data.final_balance + hold);
                  console.log(reqOrder.amount);
                  if (data.final_balance >= hold + Number(sanitizeHtml(reqOrder.amount))) {
                    newOrder.save((err) => {
                      if (err) {
                        res.json({order: 'Không thể đặt lệnh'});
                      } else {
                        startOrderMatching(sanitizeHtml(reqOrder.coin), reqOrder.userId);
                        res.json({order: 'success'})
                      }
                    });
                  } else {
                    res.json({order: `Không đủ ${sanitizeHtml(reqOrder.coin)}`});
                  }
                });
              });
            } else {
              res.json({order: 'Không thể đặt lệnh'});
            }
          } else {
            const address = user.addresses.filter((a) => {
              return a.coin === 'USDT';
            });
            if (address.length > 0) {
              usdt.getAddress(address[0].address).catch(() => {
                res.json({order: 'Không thể đặt lệnh'});
              }).then((data) => {
                usdt.getHold(user._id)
                  .catch(() => {
                    res.json({order: 'Không thể đặt lệnh'});
                  })
                  .then((hold) => {
                    if (data.final_balance / 100000 >= hold + (Number(sanitizeHtml(reqOrder.amount)) / unit * Number(reqOrder.price))) {
                      newOrder.save((err) => {
                        if (err) {
                          res.json({order: 'Không thể đặt lệnh'});
                        } else {
                          startOrderMatching(sanitizeHtml(reqOrder.coin), reqOrder.userId);
                          res.json({ order: 'success' })
                        }
                      });
                    } else {
                      res.json({ order: 'Không đủ USDT' });
                    }
                  });
              });
            } else {
              res.json({order: 'Không thể đặt lệnh'});
            }
          }
        } else {
          res.json({ order: 'Không thể đặt lệnh' });
        }
      }
    });
  } else {
    res.json({ order: 'Thiếu thông tin' });
  }
}
export function getOrder(req, res) {
  if (req.params.type && req.params.coin) {
    Order.aggregate([
      {
        $match: {
          type: sanitizeHtml(req.params.type),
          coin: sanitizeHtml(req.params.coin),
          amountRemain: { $gt: 0 },
          stage: "open"
        },
      },
      {
        $group: {
          _id: "$price",
          amountRemain: { $sum: "$amountRemain"},
          coin: { $first: "$coin" },
          stage: { $first: "$stage" },
          type: { $first: "$type" },
        }
      },
      {
        $project: {
          price: "$_id",
          amountRemain: "$amountRemain" ,
          coin:  "$coin" ,
          stage:  "$amountRemain" ,
          type:  "$type" ,
        }
      },
      { $sort: { _id: (sanitizeHtml(req.params.type) === 'buy') ? -1 : 1 } },
      { $limit: 30 },
    ]).exec((err, order) => {
      if (err) {
        res.json({ order: [] });
      } else {
        res.json({ order: order });
      }
    })
  } else {
    res.json({ order: [] });
  }
}
export function getMyOrder(req, res) {
  if (req.params.userName && req.params.coin) {
    User.findOne({ userName: sanitizeHtml(req.params.userName) }).exec((err, user) => {
      if (err) {
        res.json({ order: [] });
      } else {
        if (user) {
          Order.aggregate([
            {
              $match: {
                userId: user._id,
                coin: sanitizeHtml(req.params.coin),
                $or: [{stage: 'open'}, {stage: 'cancel'}, {stage: 'done'}]
                // stage: 'open',
              },
            },
            {
              $group: {
                _id: '$stage',
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
              }
            },
            {
              $sort: { dateCreated: -1 }
            }
          ]).exec((err2, order) => {
            if (err2) {
              res.json({ order: [] });
            } else {
              const arr = order.filter((o) => { return o._id === 'cancel'});
              const arr2 = order.filter((o) => { return o._id === 'open'});
              const arr3 = order.filter((o) => { return o._id === 'done'});
              const cancel = (arr.length > 0) ? arr[0].order : [];
              const open = (arr2.length > 0) ? arr2[0].order : [];
              const done = (arr3.length > 0) ? arr3[0].order : [];
              res.json({ order: { open, cancel, done } });
            }
          })
        } else {
          res.json({ order: [] });
        }
      }
    });
  } else {
    res.json({ order: [] });
  }
}
export function deleteOrder(req, res) {
  const reqOrder = req.body.del;
  if (reqOrder &&
    reqOrder.hasOwnProperty('orderId') &&
    reqOrder.hasOwnProperty('userName')
  ) {
    User.findOne({ userName: reqOrder.userName }).exec((err, user) => {
      if (err) {
        res.json({ order: 'Không thể xóa lệnh.' });
      } else {
        if (user) {
          Order.findOneAndUpdate({ _id: reqOrder.orderId, userId: user._id }, { stage: 'cancel' }, { new: true }).exec((err2, order) => {
            if (err2) {
              res.json({ order: 'Không thể xóa lệnh.' });
            } else {
              ordersIndividualAndHold({ coin: order.coin, id: order.userId });
              res.json({ order: 'success' });
            }
          });
        } else {
          res.json({ order: 'Không thể xóa lệnh.' });
        }
      }
    });
  } else {
    res.json({ order: 'Thiếu thông tin' });
  }
}
export function send(req, res) {
  const reqSend = req.body.send;
  if (reqSend &&
      reqSend.hasOwnProperty('id') &&
      reqSend.hasOwnProperty('address') &&
      reqSend.hasOwnProperty('amount') &&
      reqSend.hasOwnProperty('coin')
  ) {
    User.findOne({ _id: reqSend.id }).exec((err, user) => {
      if (err) {
        res.json({ order: 'error' });
      } else {
        if (user) {
          const address = user.addresses.filter(add => {return add.coin === reqSend.coin;} );
          switch (reqSend.coin) {
            case 'BTC': {
              let bool = true;
              btc.directTransfer(address[0].address, address[0].private, reqSend.address, Number(reqSend.amount)).catch((errors) => {
                bool = false;
                res.json({ order: 'error' });
                return;
              }).then((data) => {
                if (bool) {
                  const directHistory = {
                    txHash: data,
                    coin: reqSend.coin,
                  };
                  User.findOneAndUpdate(
                    {_id: reqSend.id},
                    {$push: {directHistory}},
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                    ).exec((err2) => {
                    if (err2) {
                      res.json({order: 'missing'});
                    } else {
                      res.json({order: 'success'});
                    }
                  });
                }
              });
              break;
            }
            case 'USDT': {

              break;
            }
            case 'ETH': {

              break;
            }
            default: {
              res.json({ order: 'missing' });
            }
          }
        } else {
          res.json({ order: 'not found' });
        }
      }
    });
  } else {
    res.json({ order: 'missing' });
  }
}
