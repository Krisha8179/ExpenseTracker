const Expense = require('../models/Expense');
const User = require('../models/User');
const Filedownloaded = require('../models/Filedownloaded');
const sequelize = require('../util/database');
const AWS = require('aws-sdk')
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3sevices');
const jwt = require('jsonwebtoken');

function isStringInvalid(str){
    if(str == undefined || str.length === 0){
        return true
    }
    else{
        return false
    }
}


exports.downloadexpense = async(req,res)  => {
    try{

    if(!req.user.ispremimuser){
        return res.status(401).json({ success: false, message: 'User Unauthorized'})
    }
    const expenses = await UserServices.getExpenses(req);
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, fileName);
    const downloadedfileurl = await req.user.createFiledownloaded({FileUrl: fileUrl, userId: userId})
    const downloadedFiles = await Filedownloaded.findAll({
        attributes: ['fileUrl']
    });
    console.log(downloadedFiles)
    res.status(200).json({ fileUrl, previousDownloadedFiles: downloadedFiles, success: true})
    }catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '',success: false})
    }
}


exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
    
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const totalCost = Number(req.user.totalCost) + Number(amount);
    

    if(isStringInvalid(description) || isStringInvalid(category) || isStringInvalid(amount)){
        return res.status(400).json({err: "some parameters missing"})
    }

    const data = await req.user.createExpense({amount: amount,description: description,category: category},{transaction: t})

    await req.user.update({totalCost: totalCost},{transaction: t})
    await t.commit();

    return res.status(201).json({newExpense: data, message: "expense added"});
    } catch(err){
        await t.rollback();
        res.status(500).json({
            error: err
        })
    };
}


exports.getExpenses = async (req,res)=> {

    try{
    const page = Number(req.query.page || 1);
    const ITEMS_PER_PAGE = Number(req.query.limit)
    console.log('page:',page,'limit:',ITEMS_PER_PAGE)
    const totalExpenses = await Expense.count({where: {userId: req.user.id}});
    const expenses = await Expense.findAll({where: {
        userId: req.user.id},
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
    });
    return res.status(200).json({
        allExpenses: expenses,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalExpenses,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalExpenses / ITEMS_PER_PAGE) 
    })
    } catch(err){
        console.log('error in getting expenses', err);
        return res.status(500).json({error: err})
    }
}



exports.deleteExpense =  async (req, res) => {
    const t = await sequelize.transaction();

    try{
        const expenseId = req.params.id;
        if(expenseId== 'undefined' || expenseId.length == 0){
            console.log('Id is missing')
            return res.status(400).json({err: 'ID is missing'})
        }
        const expenseObj = await Expense.findOne({where:{id: expenseId}});
        console.log('amount need to minus id: ',expenseObj.amount)
        console.log('total user amount:',req.user.totalCost)
        const totalCost = Number(req.user.totalCost) - Number(expenseObj.amount);

        await Expense.destroy({where: {id: expenseId, userId: req.user.id}},{transaction: t});
        await req.user.update({totalCost: totalCost},{transaction: t})
        await t.commit();
        
        return res.status(200).json({success: true, message: "successfully deleted"});
    } catch(err){
        await t.rollback();
        console.log(err);
        return res.status(500).json({message: "failed"})
    }
}

