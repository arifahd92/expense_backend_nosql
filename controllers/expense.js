const sequelize = require("../db/connection");
const Expense = require("../models/expense");
const User = require("../models/user");

//m- post=>add-expense
const addExpense = async (req, res) => {
  console.log("add expense controller");
  const t = await sequelize.transaction();
  try {
    // const {userId} = req.params;
    const userId = req.userId;
    const { amount, category } = req.body;
    const input = req.body;
    const prevTotal = req.user.totalExpenseAmount;
    const currentTotal = +prevTotal + +amount;
    if (category == "Movie") {
      const prevAmount = req.user.totalMovieExpense;
      const total = prevAmount + +amount;
      await req.user.update(
        { totalMovieExpense: total, totalExpenseAmount: currentTotal },
        { transaction: t }
      );
    } else if (category == "Shopping") {
      const prevAmount = req.user.totalShoppingExpense;
      const total = prevAmount + +amount;
      await req.user.update(
        { totalShoppingExpense: total, totalExpenseAmount: currentTotal },
        { transaction: t }
      );
    } else if (category == "Groccery") {
      const prevAmount = req.user.totalGrocceryExpense;
      const total = prevAmount + +amount;
      await req.user.update(
        { totalGrocceryExpense: total, totalExpenseAmount: currentTotal },
        { transaction: t }
      );
    } else if (category == "Rent") {
      const prevAmount = req.user.totalRentExpense;
      const total = prevAmount + +amount;
      await req.user.update(
        { totalRentExpense: total, totalExpenseAmount: currentTotal },
        { transaction: t }
      );
    }
    const createdData = await Expense.create(
      { ...input, userId },
      { transaction: t }
    );
    console.log("added");
    await t.commit();
    res.send(createdData);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.json({ error: "some thing went wrong" });
  }
};

// m-get => get-expense
const getExpense = async (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  const offset = page * pageSize;
  try {
    console.log("getExpense controller");
    const userId = req.userId;
    // const token = req.cookies.token;
    //console.log ('token from cookie*********************', token);
    const totalRecords = await Expense.count({
      where: { userId },
    });
    const premium = req.user.premium;
    console.log({ userId });
    console.log(page, pageSize, totalRecords);
    //const expenses = await Expense.findAll({ where: { userId } });
    console.log({ offset, pageSize });
    const expenses = await Expense.findAll({
      offset: offset,
      limit: pageSize,
      where: {
        userId,
      },
    });
    // console.log(expenses);
    res.json({
      data: expenses,
      premium: premium,
      total: req.user.totalExpenseAmount,
      totalRecords,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong in getting data" });
  }
};

//m-delete =>delete-expense/:expenseId
const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findOne({ where: { id: expenseId } });
    //console.log ('i m req.user', req.user);
    const prevTotal = req.user.totalExpenseAmount;
    const amount = expense.amount; // that is being deleted
    const totalAmount = +prevTotal - +amount;
    const category = expense.category;
    console.log(
      "**************************************************************************************************"
    );
    console.log({ category });
    if (category == "Movie") {
      const prevAmount = req.user.totalMovieExpense;
      const total = prevAmount - expense.amount;
      await req.user.update(
        { totalMovieExpense: total, totalExpenseAmount: totalAmount },
        { transaction: t }
      );
    } else if (category == "Shopping") {
      console.log("delete shopping");
      const prevAmount = req.user.totalShoppingExpense;
      const total = prevAmount - expense.amount;
      console.log({ total });
      await req.user.update(
        { totalShoppingExpense: total, totalExpenseAmount: totalAmount },
        { transaction: t }
      );
    } else if (category == "Groccery") {
      const prevAmount = req.user.totalGrocceryExpense;
      const total = prevAmount - expense.amount;
      await req.user.update(
        { totalGrocceryExpense: total, totalExpenseAmount: totalAmount },
        { transaction: t }
      );
    } else if (category == "Rent") {
      const prevAmount = req.user.totalRentExpense;
      const total = prevAmount - expense.amount;
      await req.user.update(
        { totalRentExpense: total, totalExpenseAmount: totalAmount },
        { transaction: t }
      );
    }
    const deletedData = await Expense.destroy(
      { where: { id: expenseId } },
      { transaction: t }
    );
    //console.log (deletedData);
    await t.commit();
    res.send({ message: "success" });
  } catch (error) {
    console.log(error.message);
    await t.rollback();
    res.send({ error: error.message });
  }
};
//m-put =>update-expense/:expenseId
const updateExpense = async (req, res) => {
  console.log("update expense contyroller");
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.expenseId;
    console.log({ expenseId });
    const updatedData = req.body;
    const { amount: newAmount } = req.body; //7
    const expense = await Expense.findByPk(expenseId);
    const prevAmount = expense.amount; //say 5
    const difference = +newAmount - prevAmount; //it will be used in category total

    const updatedTotal = req.user.totalExpenseAmount + +difference;
    const category = expense.category;
    console.log(
      "**************************************************************************************************"
    );
    console.log({ category });
    if (category == "Movie") {
      const prevAmount = req.user.totalMovieExpense;
      const total = prevAmount + +difference;
      await req.user.update(
        { totalMovieExpense: total, totalExpenseAmount: updatedTotal },
        { transaction: t }
      );
    } else if (category == "Shopping") {
      console.log("update shopping");
      const prevAmount = req.user.totalShoppingExpense;
      const total = prevAmount + +difference;
      console.log({ total });
      await req.user.update(
        { totalShoppingExpense: total, totalExpenseAmount: updatedTotal },
        { transaction: t }
      );
    } else if (category == "Groccery") {
      const prevAmount = req.user.totalGrocceryExpense;
      const total = prevAmount + +difference;
      await req.user.update(
        { totalGrocceryExpense: total, totalExpenseAmount: updatedTotal },
        { transaction: t }
      );
    } else if (category == "Rent") {
      const prevAmount = req.user.totalRentExpense;
      const total = prevAmount + +difference;
      await req.user.update(
        { totalRentExpense: total, totalExpenseAmount: updatedTotal },
        { transaction: t }
      );
    }

    console.log(updatedData);
    const [count] = await Expense.update(
      updatedData,
      {
        // array will be returned
        where: { id: expenseId },
      },
      { transaction: t }
    );
    console.log({ count });

    if (count === 0) {
      // If no rows were updated, it likely means the expense with the given ID doesn't exist.
      await t.rollback();
      res.status(404).send({ error: "Expense not found" });
    } else {
      await t.commit();
      res.send({ message: "success" });
    }
  } catch (error) {
    console.log(error.message);
    await t.rollback();
    res.send({ error: error.message });
  }
};
module.exports = { addExpense, getExpense, deleteExpense, updateExpense };
