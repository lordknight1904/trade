import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const exchangeSchema = new Schema({
  txHash: { type: 'String', require: true },
  amount: { type: 'number', require: true },
  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Exchange', exchangeSchema);
