const express = require ('express');
const {
  getExpense,
  addExpense,
  deleteExpense,
  updateExpense,
} = require ('../controllers/expense');
const {findId} = require ('../middleware/authenticate');
const router = express.Router ();
router.get ('/get-expense', findId, getExpense);

router.post ('/add-expense/', findId, addExpense);

router.delete ('/delete-expense/:expenseId', findId, deleteExpense);

router.put ('/update-expense/:expenseId', findId, updateExpense);

module.exports = router;
