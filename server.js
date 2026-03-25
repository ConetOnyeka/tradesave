require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Transaction = require("./models/Transaction");

const app = express();

/* -------------------------
MIDDLEWARE
------------------------- */
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

/* -------------------------
CONNECT MONGODB
------------------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* -------------------------
ADD TRANSACTION
------------------------- */
app.post("/api/add-transaction", async (req, res) => {
  try {
    const { type, description, amount, userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const transaction = new Transaction({
       userId,   // 🔥 MUST EXIST
       type,
       description,
       amount
    })

    await transaction.save()

    res.json({ message: "Transaction saved successfully" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})
/* -------------------------
GET TRANSACTIONS
------------------------- */
app.get("/api/transactions", async (req, res) => {
  try {
    const userId = req.query.userId
    

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 })

    res.json(transactions)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})
/* -------------------------
START SERVER
------------------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});