const Transaction = require("../models/transaction.model");

const User = require("../models/user.model");
// CREATE - Admin only
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes, userId } = req.body;

    const user = await User.findById(userId);

    if(!user){
        res.status(404).json({message: "Target user not found"});
    }
    const txn = await Transaction.create({
      userId,
      createdBy: req.user.id,
      amount,
      type,
      category,
      date,
      notes
    });

    res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: txn
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ - Analyst + Admin
exports.getTransactions = async (req, res) => {
  try {
    let filter = {
      isDeleted: { $ne: true}
    };

    const role = req.user.role.toUpperCase();

    if(role !== "ADMIN" && role !== "ANALYST"){
        filter.userId = req.user.id;
    }

  
    if(req.query.type){
        filter.type = req.query.type.toUpperCase();
    }
    if(req.query.category){
        filter.category = req.query.category;
    }

    const search = req.query.search?.trim();

    if (search) {
      filter.$or = [
        { category: { $regex: req.query.search, $options: "i" } },
        { notes: { $regex: req.query.search || "", $options: "i" } }
      ];
    }

    /*
    Auto-fix pagination values(incase of invalid values)
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Invalid pagination values"
      });
    }

    const skip = (page - 1) * 5;

    const transactions = await Transaction.find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      page, 
      limit,
      total,
      totalPages: Math.ceil(total/limit),
      data: transactions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - Admin only
exports.updateTransaction = async (req, res) => {
  try {
    const existing = await Transaction.findById(req.params.id);

    if (!existing || existing.isDeleted) {
      return res.status(404).json({
        message: "Transaction not found or deleted"
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      existing.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized to update this transaction"
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No fields provided for update"
      });
    }

    const allowedFields = ["amount", "type", "category", "date", "notes"];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update"
      });
    }

    if (updates.type) {
      updates.type = updates.type.trim().toUpperCase();
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE - Admin only
exports.deleteTransaction = async (req, res) => {
  try {
    const txn = await Transaction.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: "after" }
    );

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      success: true,
      message: "Transaction deleted (soft)"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreTransaction = async (req, res) => {
  try {
    // Find the transaction first
    const txn = await Transaction.findById(req.params.id);

    if (!txn || !txn.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or not deleted"
      });
    }

    // Restore the transaction
    txn.isDeleted = false;
    await txn.save();

    res.json({
      success: true,
      message: "Transaction restored successfully",
      data: txn
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};