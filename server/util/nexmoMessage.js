import Nexmo from 'server/util/nexmoMessage';
import User from '../models/user';
import Transaction from '../models/transaction';
const nexmo = new Nexmo({
  apiKey: '47e8a7ba',
  apiSecret: '105868db6116969c'
});
export function sendSMSByNexmo(to, text){
  if (to.length === '10' || to.length === '11') {
    nexmo.message.sendSms('Diginex', `+84 ${to.slice(1)}`, text);
  }
}
export function scanInformRequire(coin){
  Transaction.find({ coin }, {}, { $sort: { dateCreated: -1 } }).exec((err, transaction) => {
    if (err) {
      console.log(err);
    } else {
      const latestPrice = transaction[0].price;
      User.find({}).exec((errUser, users) => {
        if (errUser) {
          console.log(errUser);
        } else {
          if (users && user.phone !== '' && user.approved) {
            const arr = [];
            users.map((u) => {
              u.requireInform.map((r) => {
                if (r.coin === coin) {
                  arr.push(r._id);
                  if (r.max !== -1 || r.max < latestPrice) {
                    this.sendSMSByNexmo(user.phone, `Tỉ giá ${coin}/USDT đã vượt qua ${r.max}/USDT`);
                  }
                  if (r.min !== -1 || r.min > latestPrice) {
                    this.sendSMSByNexmo(user.phone, `Tỉ giá ${coin}/USDT đã thấp hơn ${r.min}/USDT`);
                  }
                }
              });
              User.findOneAndUpdate(
                { _id: u._id },
                { $pullAll: { requireInform: arr }},
                ).exec(() => {})
            });
          }
        }
      })
    }
  })
}
