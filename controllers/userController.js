// import model in userController.js file
const users = require('../Models/userSchema')
// import jsonwebtocken
const jwt = require('jsonwebtoken')


// define logic to resolve diffrent http client requests

// register
exports.register = async (req, res) => {
    // register logic
    console.log(req.body);
    // get data send by front end
    const { username, acno, password } = req.body
    if (!username || !acno || !password) {
        res.status(403).json("All inputs are required")
    }
    // check user is a existing user
    try {
        const preuser = await users.findOne({ acno })
        if (preuser) {
            res.status(406).json("User Already Exist")
        } else {
            // add new user
            const newuser = new users({
                username,
                password,
                acno,
                balance: 5000,
                transactions: []
            })
            // to save newuser into mongodb
            await newuser.save()
            res.status(200).json(newuser)
        }
    }
    catch (error) {
        res.status(401).json(error)
    }
}

// login
exports.login = async (req, res) => {
    // get req body
    const { acno, password } = req.body
    try {
        // check acno and password in db
        const preuser = await users.findOne({ acno, password })
        // check preuser or not
        if (preuser) {
            // generate tocken using jwt
            const token = jwt.sign({
                loginAcno: acno
            }, "supersecretkey12345")
            // send to client
            res.status(200).json({ preuser, token })
        }
        else {
            res.status(404).json("Invalid account number or password")
        }

    }
    catch (error) {
        res.status(401).json(error)
    }
}

// get balance
exports.getbalance = async (req, res) => {
    // get acno from path parameter
    let acno = req.params.acno

    // get data of given acno
    try {
        // find acno from users collection
        const preuser = await users.findOne({ acno })
        if (preuser) {
            res.status(200).json(preuser.balance)
        } else {
            res.status(404).json("Invalid Account Number")
        }
    }
    catch (error) {
        res.status(401).json(error)
    }
}

// fund transfer
exports.transfer = async (req, res) => {
    console.log("Inside transfer logic");
    // logic
    // 1. get body from req : creditacno,creditamnt,pswd
    const { creditAcno, creditAmount, pswd } = req.body
    // 
    let amt = Number(creditAmount)
    const { debitAcno } = req
    console.log(debitAcno);
    try {
        // 2. check debit acno and pswd in mongodb
        const debitUserDetails = await users.findOne({ acno: debitAcno, password: pswd })
        console.log(debitUserDetails);

        // 3. get credit acno details from mongodb
        const creditUserDetails = await users.findOne({ acno: creditAcno })
        console.log(creditUserDetails);

        if (debitAcno != creditAcno) {
            if (debitUserDetails && creditUserDetails) {
                // check sufficient balance available in debituserdetails
                if (debitUserDetails.balance >= creditAmount) {
                    // PERFORM TRANSFER
                    // debit creditAmount from debitUserDetails
                    debitUserDetails.balance -= amt
                    // add debit transaction to debitUserDetails
                    debitUserDetails.transactions.push({
                        transaction_type: "DEBIT", amount: creditAmount, fromAcno: debitAcno, toAcno: creditAcno
                    })
                    // save debitUserDetails in mongodb
                    await debitUserDetails.save()

                    // credit creditAmount to creditUserDetails
                    creditUserDetails.balance += amt
                    // add credit transaction to creditUserDetails
                    creditUserDetails.transactions.push({
                        transaction_type: "CREDIT", amount: creditAmount, fromAcno: debitAcno, toAcno: creditAcno
                    })
                    // save creditUserDetails in mongodb
                    await creditUserDetails.save()
                    // res
                    res.status(200).json("Tranfer Success")
                } else {
                    // insufficient
                    res.status(406).json("Insufficient Balance")
                }

            } else {
                res.status(406).json("Invalid credit/debit Details")
            }

        } else {
            res.status(406).json("Operation Denied - Self transaction doesn't allowed")
        }



    }
    catch (error) {
        res.status(401).json(error)
    }
}

// getTransactions
exports.getTransactions = async (req, res) => {
    // 1. get acno from req.debitAcno
    let acno = req.debitAcno

    try {
        // 2. check acno in mongodb
        const preuser = await users.findOne({ acno })
        res.status(200).json(preuser.transactions)
    }
    catch (error) {
        res.status(401).json("Invalid Account Number")
    }
}

// Delete My Account
exports.deleteMyAcno = async (req, res) => {
    // get acno from req
    let acno = req.debitAcno

    // remove acno from db
    try{
        await users.deleteOne({acno})
        res.status(200).json("Successfully Deleted")
    }
    catch(error){
        res.status(401).json(error)
    }
}