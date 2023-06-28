const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth');

const expenseController = require('../controllers/expense');


router.post('/expense/add-expense',userAuthentication.authenticate,expenseController.addExpense);
router.get('/expense/get-expenses',userAuthentication.authenticate,expenseController.getExpenses);
router.delete('/expense/delete-expense/:id',userAuthentication.authenticate,expenseController.deleteExpense);

module.exports = router;

