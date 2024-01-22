const { default: mongoose } = require('mongoose');
const sequelize = require ('../db/connection');

const Expense = require ('../models/expense');
const User = require ('../models/user');
//m-get => /premium-leaderboard


const leaderboard = async (req, res, next) => {
  console.log('leaderboard controller');
  try {
    const users = await User.aggregate([
      {
        $project:{
           _id:1,
           name:1,
           totalExpenseAmount:1
        }
      },
      {
        $sort:{totalExpenseAmount:-1}
      }
    ]);
    res.json(users);
  } catch (err) {
    console.log('leaderboard');
    console.log(err.message);
    res.send({ message: 'error' });
  }
};


//m-get=>/premium/report-card

const reportCard = async (req, res) => {
  const userId = req.userId;

  try {
    // Aggregate pipeline to group expenses by category and calculate total for each category
    const result = await Expense.aggregate([
      {
        $match: { creator: userId },
      },

      {
        $group: {
          _id: "$category",
          expenses: { $push: "$$ROOT" },
          total: { $sum: { $toDouble: "$amount" } },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
    
 console.log("report card")
 let user =req.user
 console.log([user,result])
    res.send([user,...result]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {leaderboard, reportCard};
