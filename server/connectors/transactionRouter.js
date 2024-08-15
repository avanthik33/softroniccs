const express = require("express");
const UserModel = require("../models/UserModel");
const Transaction = require("../models/TransactionModel");

const router = express.Router();

router.get("/transaction/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).populate("transactions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Deposit operation
router.post("/deposit/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    let { amount } = req.body.amount;
    amount = parseInt(req.body.amount, 10); 
    console.log(amount)

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += amount;
    const transaction = new Transaction({
      user: userId,
      amount: amount,
      type: "deposit",
    });

    user.transactions.push(transaction);
    await transaction.save();
    await user.save();

    res.json({
      status: "success",
      message: "Deposit successful",
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error",error:error.message });
  }
});

// Withdrawal operation
router.post("/withdraw/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    const transaction = new Transaction({
      user: userId,
      amount: amount,
      type: "withdrawal",
    });

    user.transactions.push(transaction);
    await transaction.save();
    await user.save();

    res.json({ message: "Withdrawal successful", balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
