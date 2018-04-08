import Transaction from '../models/transaction';
import User from '../models/user';
import sanitizeHtml from 'sanitize-html';
import * as btc from '../util/btc';
import * as eth from '../util/eth';
import * as usdt from '../util/usdt';

export function getCoinLatestPrice(req, res) {
  Transaction.aggregate([
    {
      $match: {
        coin: req.params.coin,
      },
    },
    {
      $group: {
        _id: '$price',
        date: { $last: '$dateCreated' },
      },
    },
    { $sort: { date: -1 } },
  ]).exec((err, prices) => {
    if (err) {
      res.json({ coin: req.params.coin, price: 0, volume: 0, transactions: [] });
    } else {
      switch (prices.length) {
        case 0: {
          res.json({ coin: req.params.coin, price: 0, volume: 0, transactions: [] });
          break;
        }
        case 1: {
          Transaction.aggregate([
            {
              $match: {
                coin: req.params.coin,
                price: prices[0]._id,
                dateCreated: { $gte: new Date(prices[0].date) },
              },
            },
            {
              $group: {
                _id: '',
                volume: { $sum: '$amount' },
                transactions: {
                  $push: {
                    _id: '$_id',
                    from: '$from',
                    to: '$to',
                    amount: '$amount',
                    price: '$price',
                    feeCoin: '$feeCoin',
                    feeUsdt: '$feeUsdt',
                    coin: '$coin',
                    txCoin: '$txCoin',
                    txUsdt: '$txUsdt',
                  },
                },
              },
            },
          ]).exec((err2, transactions) => {
            if (err2) {
              res.json({ coin: req.params.coin, price: 0, volume: 0, transactions: [] });
            } else {
              res.json({ coin: req.params.coin, price: prices[0]._id, volume: transactions[0].volume, transactions: transactions[0].transactions });
            }
          });
          break;
        }
        default: {
          Transaction.aggregate([
            {
              $match: {
                coin: req.params.coin,
                price: prices[0]._id,
                dateCreated: { $gte: new Date(prices[1].date) },
              },
            },
            {
              $group: {
                _id: '',
                volume: { $sum: '$amount' },
                transactions: {
                  $push: {
                    _id: '$_id',
                    from: '$from',
                    to: '$to',
                    amount: '$amount',
                    price: '$price',
                    feeCoin: '$feeCoin',
                    feeUsdt: '$feeUsdt',
                    coin: '$coin',
                    txCoin: '$txCoin',
                    txUsdt: '$txUsdt',
                  },
                },
              },
            },
          ]).exec((err2, transactions) => {
            if (err2) {
              res.json({ coin: req.params.coin, price: 0, volume: 0, transactions: [] });
            } else {
              res.json({ coin: req.params.coin, price: prices[0]._id, volume: transactions[0].volume, transactions: transactions[0].transactions });
            }
          });
        }
      }
    }
  });
}
export function getTransaction(req, res) {
  const page = req.query.page ? req.query.page: 0;
  if (req.params.userName && req.params.coin) {
    User.findOne({ userName: req.params.userName }).exec((err, user) => {
      if (err) {
        res.json({ transaction: [] });
      } else {
        if (user) {
          Transaction
            .find({ $or: [{ from: user._id }, { to: user._id }], coin: req.params.coin })
            .limit(20)
            .skip(20 * page)
            .populate('from', { userName: 1, _id: 0 })
            .populate('to', { userName: 1, _id: 0 })
            .exec((err2, transaction) => {
            if (err2) {
              res.json({ transaction: [], count: 0 });
            } else {
              Transaction.find({ $or: [{ from: user._id }, { to: user._id }], coin: req.params.coin }).count().exec((err3, count) => {
                if (err3) {
                  res.json({ transaction: [], count: 0 });
                } else {
                  const temp1 = Math.round(count / 20);
                  const temp2 = (count % 20 === 0) ? 0 : 1;
                  const length = temp1 + temp2;
                  res.json({ transaction, count: (count !== 0) ? length : 0 });
                }
              });
            }
          })
        } else {
          res.json({ transaction: [], count: 0 });
        }
      }
    });
  } else {
    res.json({ transaction: [], count: 0 });
  }
}
export function getHash(req, res) {
  if (req.params.coin && req.params.txHash) {
    switch (req.params.coin) {
      case 'BTC': {
        btc.getHash(req.params.txHash).catch(() => {
          res.json({ confirmations: -1 });
        }).then((data) => {
          res.json({ confirmations: data });
        });
        break;
      }
      case 'ETH': {
        eth.getHash(req.params.txHash).catch(() => {
          res.json({ confirmations: -1 });
        }).then((data) => {
          res.json({ confirmations: data });
        });
        break;
      }
      case 'USDT': {
        usdt.getHash(req.params.txHash).catch(() => {
          res.json({ confirmations: -1 });
        }).then((data) => {
          res.json({ confirmations: data });
        });
        break;
      }
      default: {
        res.json({ confirmations: -1 });
      }
    }
  } else {
    res.json({ confirmations: -1 });
  }
}
