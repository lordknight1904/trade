import Transaction from '../models/transaction';
import User from '../models/user';
import sanitizeHtml from 'sanitize-html';
import * as btc from '../util/btc';
import * as usdt from '../util/usdt';

export function getCoinLatestPrice(req, res) {
  Transaction.find({ coin: req.params.coin }, {}, { sort: { dateCreated: -1 } }).exec((err, transactions) => {
    if (err) {
      res.json({ rate: { coin: req.params.coin, price: 0 } });
    } else {
      if (transactions.length === 0) {
        res.json({ rate: { coin: req.params.coin, price: 0 } });
      } else {
        res.json({ rate: { coin: req.params.coin, price: transactions[0].price } });
      }
    }
  });
}
export function getTransaction(req, res) {
  if (req.params.userName && req.params.coin) {
    User.findOne({ userName: req.params.userName }).exec((err, user) => {
      if (err) {
        res.json({ transaction: [] });
      } else {
        if (user) {
          Transaction
            .find({ $or: [{ from: user._id }, { to: user._id }], coin: req.params.coin })
            .select({ _id: 0 })
            .populate('from', { userName: 1, _id: 0 })
            .populate('to', { userName: 1, _id: 0 })
            .exec((err2, transaction) => {
            if (err2) {
              res.json({ transaction: [] });
            } else {
              res.json({ transaction });
            }
          })
        } else {
          res.json({ transaction: [] });
        }
      }
    });
  } else {
    res.json({ transaction: [] });
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
