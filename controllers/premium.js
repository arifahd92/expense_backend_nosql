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
/*
const reportCard = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user by ID
    const user = await User.findOne ({
      where: {
        id: userId,
      },
      attributes: [
        'name',
        'email',
        'totalShoppingExpense',
        'totalRentExpense',
        'totalMovieExpense',
        'totalGrocceryExpense',
        'totalExpenseAmount',
      ],
    });

    if (!user) {
      return res.status (404).json ({message: 'User not found'});
    }
    const categoryArr = Object.values (user.dataValues).filter (
      elm => elm !== 0
    );
    console.log (user);
    console.log (
      '**********************************************************************'
    );
    // console.log (categoryArr);
    // Fetch the user's expenses, sorted by category in descending order
    const expenses = await Expense.findAll ({
      where: {UserId: userId},
      order: [['category', 'DESC']], // Sort by category in descending order
    });
    let arr = [];
    arr.push ({
      name: categoryArr[0],
      email: categoryArr[1],
      total: categoryArr[categoryArr.length - 1],
    });
    let i = 2;
    expenses.forEach ((elm, ind) => {
      console.log ('=============================================');
      if (
        ind != expenses.length - 1 &&
        elm.category != expenses[ind + 1].category
      ) {
        arr.push (elm);
        arr.push ({[elm.category]: categoryArr[i++]});
      } else {
        arr.push (elm);
      }
      if (ind == expenses.length - 1) {
        arr.push ({[expenses[ind - 1].category]: categoryArr[i++]});
      }
    });
    res.send (arr);
  } catch (error) {
    console.error (error);
    res.status (500).json ({message: 'Internal server error'});
  }
};
*/
const reportCard = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId, {
      name: 1,
      email: 1,
      totalShoppingExpense: 1,
      totalRentExpense: 1,
      totalMovieExpense: 1,
      totalGrocceryExpense: 1,
      totalExpenseAmount: 1,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
//console.log({user})
    // Fetch the user's expenses
    const expenses = await Expense.find({ creator: userId })
      .sort({ category: -1 }); // Sort by category in descending order

    const arr = [
      {
        name: user.name,
        email: user.email,
        total: user.totalExpenseAmount,
      },
    ];

    expenses.forEach((expense, index) => {
      if (
        index !== expenses.length - 1 &&
        expense.category !== expenses[index + 1].category
      ) {
        arr.push(expense, { [expense.category]: user[`total${expense.category}Expense`] });
      } else {
        arr.push(expense);
      }

      if (index === expenses.length - 1) {
        arr.push({ [expenses[index - 1].category]: user[`total${expenses[index - 1].category}Expense`] });
      }
    });

    res.send(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {leaderboard, reportCard};
