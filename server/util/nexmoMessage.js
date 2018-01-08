import Nexmo from 'nexmo';
import User from '../models/user';
import mongoose from 'mongoose';
import Transaction from '../models/transaction';
const nexmo = new Nexmo({
  apiKey: '47e8a7ba',
  apiSecret: '105868db6116969c',
});

export function sendSMSByNexmo(to, text) {
  console.log(`+84 ${to.slice(1)}`);
  nexmo.message.sendSms('Diginex', `+84 ${to.slice(1)}`, text);
}
export function scanInformRequire(coin) {
  Transaction.find({ coin }).sort({ dateCreated: -1 }).exec((err, transaction) => {
    if (err) {
      console.log(err);
    } else {
      if (transaction.length === 0) return;

    const latestPrice = transaction[0].price;
      User.find({ approved: true }).exec((errUser, users) => {
        if (errUser) {
          console.log(errUser);
        } else {
          if (users.length > 0) {
            users.map((u) => {
              let arr = [];
              if (u.requireInform.length > 0) {
                u.requireInform.map((r) => {
                  if (r.coin === coin) {
                    arr.push(mongoose.Types.ObjectId(r._id));
                    if (r.max <= latestPrice && r.max !== 0) {
                      console.log('here max');
                      sendSMSByNexmo(u.phone, `Ty gia ${coin}/USDT da vuot qua ${r.max}/USDT, gia hien tai ${latestPrice}`);
                    }
                    if (r.min >= latestPrice) {
                      console.log('here min');
                      sendSMSByNexmo(u.phone, `Ty gia ${coin}/USDT da thap hơn ${r.min}/USDT, gia hien tai ${latestPrice}`);
                    }
                  }
                });
                console.log(u._id);
                console.log(arr);
                User.update(
                  { _id: mongoose.Types.ObjectId(u._id) },
                  { $pullAll: { requireInform: arr }},
                ).exec(() => {})
              }
            });
          }
        }
      })
    }
  })
}
