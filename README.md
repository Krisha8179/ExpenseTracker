## ExpenseTracker

A node.js app for Expense Tracker.

## Server features

1. Sets up middleware for user authentication (used JWT authenticatioin).
2. Connects to the MysqlDB using sequelize for CRUD operations.
3. Used Express server to serve API endpoints.
4. Intergrated razor pay for payment gateway.
5. Integrated AWS for uploading files and getting files.
6. Intergrated sendInBlue to send mail.

## API endpoints


1. **/user/signup**  - To register new users.
2. **/user/login**  - For login users.
3. **/user/download**  - To download expenses file.
4. **/expense/add-expense**  - To add expenses to the DB.
5. **/expense/get-expenses**  - To get all expenses from the DB.
6. **/expense/delete-expense/:id**  - To delete a expense from DB.
7. **/password/updatePassword/:resetPasswordid**  - To upadate the password to DB.
8. **/password/resetPassword/:id**  - TO reset the password.
9. **/password/forgotpassword**  - To use when you forgot password.
10. **/premium/feature**  - To get the premium features.
11. **/purchase/premiummembership**  - To buy the premium membership.
12. **/purchase/updatetransactionstatus**  - To update the purchase transactions to DB.

**Note** : API endpoints '**/user/download**', '**/expense/add-expense**', '**/expense/get-expenses**', '**/expense/delete-expense/:id**', '**/password/updatePassword/:resetPasswordid**', '**/password/resetPassword/:id**', '**/password/forgotpassword**', '**/premium/feature**', '**/purchase/premiummembership**', '**/purchase/updatetransactionstatus**' needs to be authenticated by JWT token to work. The client needs to send the JSON web token through the Authorization header.

## GET expenses Request

The **/expense/get-expenses** request is need to be send with page and limit values like **/expense/get-expenses?page=2&limit=2** as pagination added to that request.

## Dependencies

* Cors (Any origin works in our API)
* Express
* sequelize(to connect to mysql)
* Mysql (schemas)
* dotenv (get the .env file working with environment variables)
* bcrypt (Hash our password) 
* JWT (Jason Web Tokens)
* body parser(to parse the incoming body requests)
* aws (To manage files)
* Razor pay (payment gateway)

 
