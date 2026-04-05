const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["INCOME", "EXPENSE"],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: String,
  isDeleted:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);