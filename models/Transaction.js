const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  userId: String, // 🔥 NEW
  type: String,
  description: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Transaction", transactionSchema)