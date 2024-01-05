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
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          totalExpenseAmount: { $first: '$totalExpenseAmount' },
        },
      },
      { $sort: { totalExpenseAmount: -1 } },
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
        $sort: {
          _id: 1, // Sort by category in ascending order
        },
      },
    ]);

    // Fetch the user details
    const user = await User.findById(userId, {
      name: 1,
      email: 1,
      totalExpenseAmount: 1,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the response array
    const arr = [
      {
        name: user.name,
        email: user.email,
        total: user.totalExpenseAmount,
      },
    ];

    // Append expenses and category totals to the response array
    result.forEach(categoryGroup => {
      arr.push(...categoryGroup.expenses);
      arr.push({ [categoryGroup._id]: categoryGroup.total });
    });

    res.send(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {leaderboard, reportCard};
