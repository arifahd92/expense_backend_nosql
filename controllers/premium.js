const sequelize = require ('../db/connection');

const Expense = require ('../models/expense');
const User = require ('../models/user');
//m-get => /premium-leaderboard
const leaderboard = async (req, res, next) => {
  console.log ('leader board controller');
  try {
    const users = await User.findAll ({
      attributes: [
        'id',
        'name',
        'totalExpenseAmount',
        /*
        [
          sequelize.fn ('SUM', sequelize.col ('Expenses.amount')),
          'totalExpenseAmount',
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [], // i just want use Expense model but dont want any field, mandatory for aggregation
        },
        */
      ],
      group: ['User.id'],

      order: [[sequelize.literal ('totalExpenseAmount'), 'DESC']],
    });

    res.json (users);
  } catch (err) {
    console.log ('leaderboard');
    console.log (err.message);
    res.send ({message: 'error'});
  }
  //for more optemization  i used  an extra coloumn  (totalExpenseAmount) in User table and we will not have to use aggregate function of sequelize to sum each time when user requests for seeing leaderboard
};
//m-get=>/premium/report-card

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

module.exports = {leaderboard, reportCard};
