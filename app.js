const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature');
const forgotPasswordRoutes = require('./routes/forgotPassword');


const cors = require('cors');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order');
const ForgotPassword = require('./models/ForgotPassword');
const Filedownloaded = require('./models/Filedownloaded');
const sequelize = require('./util/database');
 

const app = express();
app.use(bodyParser.json({extended: false}));



app.use(cors());


app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeatureRoutes);
app.use(forgotPasswordRoutes)

app.use((req, res) => {
    console.log('url is:', req.url);
    res.sendFile(path.join(__dirname, `frontend/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(Filedownloaded);
Filedownloaded.belongsTo(User);

sequelize
.sync()
.then(result => {
    //console.log(result);
    app.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
});
