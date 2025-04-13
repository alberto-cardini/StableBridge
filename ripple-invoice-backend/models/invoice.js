const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  buyerUsername: { type: String, required: true },
  supplierWallet: { type: String, required: true },
  buyerWallet: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'RLUSD' },
  description: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'paid'], default: 'pending' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);