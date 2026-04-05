const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");
// Summary API
exports.getSummary = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0;
    let expense = 0;

    data.forEach(item => {
      if (item._id === "INCOME") income = item.total;
      if (item._id === "EXPENSE") expense = item.total;
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getCategoryTotals = async (req, res) => {
    try{
        const data = await Transaction.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: {$sum: "$amount"}
                }
            }
        ]);

        res.json(data);
    }catch(err){
        res.status(500).json({message: err.message});
    }   
};

exports.getMonthlyTrends = async (req, res) => {
    try{
        const data = await Transaction.aggregate([
            {
                $group: {
                    _id: {$month: "$date"}, 
                    total: {$sum: "$amount"}
                }
            }
        ]);
        res.json(data);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getRecentTransactions = async(req, res) => {
    try{
        const activities = await Transaction.find()
            .sort({createdAt: -1})
            .limit(5);
        
        res.json({
            success: true, 
            count : activities.length,
            data : activities
        })
    } catch (err){
        res.status(500).json({message: err.message});
    }
};

exports.getMonthlyTrends = async (req, res) => {
  try {
    let match = { isDeleted: false };

    // Role-based filtering
    if (req.user.role !== "ADMIN" && req.user.role !== "ANALYST") {
        match.userId = new mongoose.Types.ObjectId(req.user.id);
    }

    const trends = await Transaction.aggregate([
      { $match: match },

      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0]
            }
          }
        }
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },

      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { 
                $cond: [
                    {$lt: ["$_id.month", 10] },
                    {$concat: ["0", {$toString: "$_id.month"}]},
                    {$toString : "$_id.month"}
                ]
              }
            ]
          },
          income: 1,
          expense: 1,
          net:{
            $subtract: ["$income", "$expense"]
          },
          status:{
            $cond: [
                {$gte: ["income", "expense"]},
                "Profit",
                "Loss"
            ]
          }
        }
      }
    ]);

    // console.log("req.user.id:", req.user.id);
    // console.log("match:", match);

    res.json({
      success: true,
      data: trends
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryAnalytics = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }
    const role = req.user.role.toUpperCase();
    
    let match = { isDeleted: false };

    if (req.user.role !== "ADMIN" && req.user.role !== "ANALYST") {
      match.userId = new mongoose.Types.ObjectId(req.user.id);
    }
    if (req.query.type) {
      match.type = req.query.type.trim().toUpperCase();
    }

    // console.log("MATCH:", match);

    const result = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};