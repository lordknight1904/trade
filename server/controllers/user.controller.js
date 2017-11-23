import User from '../models/user';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';
import * as btc from '../util/btc';
import * as usdt from '../util/usdt';
import * as eth from '../util/eth';
import speakeasy from 'speakeasy';
import { updateProfile } from '../routes/socket_routes/chat_socket';

function generateToken(user) {
  const u = {
    email: user.email,
    _id: user.id,
  };
  return jwt.sign(u, 'diginex', {
    expiresIn: '1h'
  });
}
export function createUser(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
    reqUser.hasOwnProperty('email') &&
    reqUser.hasOwnProperty('password') &&
    reqUser.hasOwnProperty('userName')) {
    bcrypt.genSalt(10).then((salt) => {
      bcrypt.hash(reqUser.password, salt).then((password) => {
        const newUser = new User({
          email: sanitizeHtml(reqUser.email),
          password: password,
          userName: sanitizeHtml(reqUser.userName),
          salt: salt,
          googleSecret: speakeasy.generateSecret({ length: 20 }),
          socialId: '',
        });
        newUser.save((err, user) => {
          if(err) {
            console.log(err);
            res.json({ user: { code: 'error' } });
          }
          else{
            btc.addAddress().catch((err) => {
              console.log('error');
              console.log(err);
            }).then((data) => {
              updateProfile(user._id);
              btc.faucet(data.address);
              btc.faucet(data.address);
              btc.faucet(data.address);
              btc.faucet(data.address);
              User.updateOne({ _id: user._id }, {
                $push: {
                  addresses: {
                    coin: 'BTC',
                    address: data.address,
                    private: data.private,
                  }
                }
              }, { upsert: true }).exec();
            });
            usdt.addAddress().catch((err) => {
              console.log('error');
              console.log(err);
            }).then((data) => {
              updateProfile(user._id);
              usdt.faucet(data.address);
              usdt.faucet(data.address);
              usdt.faucet(data.address);
              usdt.faucet(data.address);
              User.updateOne({ _id: user._id }, {
                $push: {
                  addresses: {
                    coin: 'USDT',
                    address: data.address,
                    private: data.private,
                  }
                }
              }, { upsert: true }).exec();
            });
            eth.addAddress().catch((err) => {
              console.log('error');
              console.log(err);
            }).then((data) => {
              updateProfile(user._id);
              eth.faucet(data.address);
              eth.faucet(data.address);
              eth.faucet(data.address);
              eth.faucet(data.address);
              User.updateOne({ _id: user._id }, {
                $push: {
                  addresses: {
                    coin: 'ETH',
                    address: data.address,
                    private: data.private,
                  }
                }
              }, { upsert: true }).exec();
            });
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true, // secure:true for port 465, secure:false for port 587
              auth: {
                user: 'virinex1904@gmail.com',
                pass: 'Apink1904'
                // pass: 'cwslawgrwfrsurrl'
              }
            });
            let content = '<div><p><span>Xin chào:  &nbsp; <b>';
            content += newUser.userName;
            content += '</b></span></p> <p>Đây là liên kết để bạn xác nhận tài khoản</p>';
            content += `<a href="http://localhost:8000/user/confirm?token=${newUser._id}`;
            content += `" target="_blank">http://diginex.com/user/confirm?token=${newUser._id}`;
            content += '</a>';
            content += '<p>Liên kết chỉ có thể sử dụng 1 lần. Cảm ơn bạn đã đăng ký! </p>';
            content += '</div>';
            const mailOptions = {
              from: '<virinex1904@gmail.com>', // sender address
              to: newUser.email, // list of receivers
              subject: 'Xác nhận đăng ký tài khoản', // Subject line
              text: '', // plain text body
              html: content,
              // attachments: [{
              //   filename: 'coin.jpg',
              //   path: 'client/Images/coin.jpg',
              //   cid: 'coin@kreata.ee' //same cid value as in the html img src
              // }]
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.json({ user: { code: 'success' } });
              }
            });
          }
        });
      });
    });
  } else {
    res.json({ user: { code: 'Thiếu thông tin.' } });
  }
}

export function verifyUser(req, res) {
  const token = req.query.token;
  if (token !== '') {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    User.findOneAndUpdate({ _id: token, dateSent: { $gte: now } }, { emailVerified: true }, { new: true }).exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        if (user) {
          res.json({ user: 'Kích hoạt tài khoản thành công.' });
        } else {
          res.json({ user: 'Không thể kích hoạt đường dẫn này.' });
        }
      }
    });
  } else {
    res.json({ user: 'error' });
  }
}

export function loginUser(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
    reqUser.hasOwnProperty('email') &&
    reqUser.hasOwnProperty('password')) {
    User.findOne({ email: reqUser.email, emailVerified: true }).exec((err, user) => {
      if (err) {
        res.json({ user: err });
      } else {
        if (user !== null) {
          bcrypt.compare(reqUser.password, user.password, (err2, result) => {
            if (err2) {
              res.json({ user: 'login fail' });
            } else {
              if (result) {
                if (user.googleAuthentication) {
                  res.json({ user: 'googleAuth', id: user._id });
                } else {
                  const token = generateToken(user);
                  const response = {
                    id: user._id,
                    email: user.email,
                    userName: user.userName,
                    googleAuthentication: user.googleAuthentication,
                    googleSecret: user.googleSecret,
                    approved: user.approved,
                    isSubmitting: user.isSubmitting,
                    realName: user.realName,
                    phone: user.phone,
                    isInform: user.isInform,
                    requireInform: user.requireInform,
                    token
                  };
                  res.json({ user: response });
                }
              } else {
                res.json({ user: 'login fail' });
              }
            }
          });
        } else {
          res.json({ user: 'login fail' });
        }
      }
    });
  }
}
export function getBalance(req, res) {
  if (req.params.userName && req.params.coin) {
    User.findOne({ userName: sanitizeHtml(req.params.userName) }).exec((err, user) => {
      if(err) {
        res.json({ user: 'Error' });
      } else {
        if (user) {
          const address = user.addresses.filter((a) => { return a.coin === sanitizeHtml(req.params.coin); });
          let api = null;
          switch (req.params.coin) {
            case 'BTC': {
              api = btc;
              break;
            }
            case 'USDT': {
              api = usdt;
              break;
            }
            case 'ETH': {
              api = eth;
              break;
            }
            default: {
              res.json({user: 'Error'});
              return;
            }
          }
          if (address.length > 0) {
            api.getAddress(address[0].address).catch((err) => {
              res.json({user: 'Error'});
            }).then((data) => {
              api.getHold(user._id)
              .catch((err2) => {
                res.json({user: 'Error'});
              })
              .then((hold) => {
                res.json({
                  user: {
                    coin: sanitizeHtml(req.params.coin),
                    address: address[0].address,
                    balance: data.balance + data.final_balance,
                    unconfirmedBalance: data.unconfirmed_balance,
                    hold: Number(hold), history: []
                  }
                });
              });
            });
          } else {
            res.json({ user: 'Địa chỉ ví không tồn tại.' });
          }
        } else {
          res.json({ user: 'Tài khoản không tồn tại.' });
        }
      }
    });
  }
}

export function getHold(req, res) {
  if (req.params.userName && req.params.coin) {
    User.findOne({ userName: sanitizeHtml(req.params.userName) }).exec((err, user) => {
      if(err) {
        res.json({ user: 'Error' });
      } else {
        if (user) {
          btc.getHold(user._id)
          .catch(() => {
            res.json({user: 'Error'});
          })
          .then((hold) => {
            res.json({ user: { coin: sanitizeHtml(req.params.coin), hold: hold } });
          });
        } else {
          res.json({ user: 'Tài khoản không tồn tại.' });
        }
      }
    });
  }
}
export function getAllias(req, res) {
  console.log(req.params);
}
export function confirmGoogleAuth(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
      reqUser.hasOwnProperty('id') &&
      reqUser.hasOwnProperty('token')
  ) {
    User.findOne({ _id: reqUser.id }).exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        if (user) {
          const userToken = reqUser.token;
          const secret = user.googleSecret.base32;
          const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: userToken
          });
          if (verified) {
            User.updateOne({ _id: reqUser.id }, { googleAuthentication: true }).exec((err) => {
              if (err) {
                res.json({ user: 'error' });
              } else {
                res.json({ user: 'success' });
              }
            });
          } else {
            res.json({ user: 'reject' });
          }
        } else {
          res.json({ user: 'not found' });
        }
      }
    })
  } else {
    res.json({ user: 'missing' });
  }
}
export function googleFactor(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
      reqUser.hasOwnProperty('id') &&
      reqUser.hasOwnProperty('googleCode')
  ) {
    User.findOne({ _id: reqUser.id }).exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        if (user) {
          const userToken = reqUser.googleCode;
          const secret = user.googleSecret.base32;
          const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: userToken
          });
          if (verified) {
            const token = generateToken(user);
            const response = {
              id: user._id,
              email: user.email,
              userName: user.userName,
              googleAuthentication: user.googleAuthentication,
              googleSecret: user.googleSecret,
              approved: user.approved,
              isSubmitting: user.isSubmitting,
              realName: user.realName,
              phone: user.phone,
              isInform: user.isInform,
              requireInform: user.requireInform,
              token
            };
            res.json({ user: response });
          } else {
            res.json({ user: 'reject' });
          }
        } else {
          res.json({ user: 'not found' });
        }
      }
    })
  } else {
    res.json({ user: 'missing' });
  }
}
export function cancelGoogleFactor(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
      reqUser.hasOwnProperty('id') &&
      reqUser.hasOwnProperty('token')
  ) {
    User.findOne({ _id: reqUser.id }).exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        if (user) {
          const userToken = reqUser.token;
          const secret = user.googleSecret.base32;
          const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: userToken
          });
          if (verified) {
            User.updateOne({ _id: reqUser.id }, { googleAuthentication: false }).exec((err) => {
              if (err) {
                res.json({ user: 'error' });
              } else {
                res.json({ user: 'success' });
              }
            });
          } else {
            res.json({ user: 'reject' });
          }
        } else {
          res.json({ user: 'not found' });
        }
      }
    })
  } else {
    res.json({ user: 'missing' });
  }
}
export function updateUserProfile(req, res) {
  const reqProfile = req.body.profile;
  if (reqProfile &&
      reqProfile.hasOwnProperty('id') &&
      reqProfile.hasOwnProperty('phone') &&
      reqProfile.hasOwnProperty('realName')
  ) {
    User.findOneAndUpdate({ _id: reqProfile.id }, { realName: reqProfile.realName, phone: reqProfile.phone, isSubmitting: true }).exec((err, user) => {
      if (err) {
        res.json({ profile: 'error' });
      } else {
        res.json({ profile: 'success' });
      }
    });
  } else {
    res.json({ profile: 'missing' });
  }
}
export function addInform(req, res) {
  const reqInform = req.body.inform;
  if (reqInform &&
      reqInform.hasOwnProperty('coin') &&
      reqInform.hasOwnProperty('id') &&
      reqInform.hasOwnProperty('min') &&
      reqInform.hasOwnProperty('max')
  ) {
    User.findOneAndUpdate(
      { _id: reqInform.id },
      { $push: { requireInform: { coin: reqInform.coin, min: reqInform.min, max: reqInform.max } }},
      {
        new: true,
        max: true,
        projection: {
          email: 1,
          userName: 1,
          googleAuthentication: 1,
          googleSecret: 1,
          approved: 1,
          isSubmitting: 1,
          realName: 1,
          phone: 1,
          isInform: 1,
          requireInform: 1,
        }
      }
      ).exec((err, user) => {
      if(err) {
        res.json({ inform: 'error' });
      } else {
        res.json({ inform: 'success', user });
      }
    })
  } else {
    res.json({ inform: 'missing' });
  }
}
export function deleteInform(req, res) {
  const reqInform = req.body.inform;
  if (reqInform &&
      reqInform.hasOwnProperty('informId') &&
      reqInform.hasOwnProperty('id')
  ) {
    User.findOneAndUpdate(
      { _id: reqInform.id },
      { $pull: { requireInform: { _id: reqInform.informId } }},
      {
        new: true,
        max: true,
        projection: {
          email: 1,
          userName: 1,
          googleAuthentication: 1,
          googleSecret: 1,
          approved: 1,
          isSubmitting: 1,
          realName: 1,
          phone: 1,
          isInform: 1,
          requireInform: 1,
        }
      }
      ).exec((err, user) => {
      if(err) {
        res.json({ inform: 'error' });
      } else {
        res.json({ inform: 'success', user });
      }
    })
  } else {
    res.json({ inform: 'missing' });
  }
}
