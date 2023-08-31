var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cors= require('cors')
var https =require('https');
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
   bodyParser.urlencoded({
     limit: "50mb",
     extended: true,
   }),
 );
app.use(bodyParser.json());
app.post('/purchase', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: '2U2eJegr3hoz5zwVmW2R1',
        server: '62.171.144.163', 
        database: 'aifi_affiliate',
  options: {
    trustServerCertificate: true
  } 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var PaymentID=req.body.payment_Id;
        var UserId = req.body.userId
        var AmountPurchased = req.body.amount_purchased
        var USDT = req.body.usdt
        var request = new sql.Request();

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(UserId)) {
            res.send("Email validation failed")
            // console.log('Please enter a valid email address');
        } else {
            if(PaymentID.length>0 && AmountPurchased>0 && USDT>0){
                let query = `exec [dbo].[DAL_PurchaseHistory]  @PaymentID= '${PaymentID}', @UserId = '${UserId}', @AmountPurchased = ${AmountPurchased}, @USDT = ${USDT};`;
                console.log(query);
                    request.query(query, function (err, recordset) {
                        if (err){
                            console.log(err)
                            res.send("Somethinmg wrong")
                        } 
                        else{
                            // send records as a response
                            res.send("Success");
                        }
                      
                        
                    });
            }
            else{
                res.send("Invalid data")
            }

        }
        
    
    });
});



app.post('/register', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: '2U2eJegr3hoz5zwVmW2R1',
        server: '62.171.144.163', 
        database: 'aifi_affiliate',

  options: {
    trustServerCertificate: true
  } 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var EmailId=req.body.email;
        var FirstName = req.body.name
        var LastName = req.body.lname
        var SponsorEmail = req.body.referral_email
        var Phone = req.body.phone
        var request = new sql.Request();
        
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(EmailId)) {
            res.send("Email validation failed")
            // console.log('Please enter a valid email address');
        } else {
            if(FirstName.length>0 && LastName.length>0 && SponsorEmail.length>0 && phone.length>0){
                let query = `exec [dbo].[DAL_User_Dump] @EmailId= '${EmailId}', @FirstName = '${FirstName}', @LastName = '${LastName}', @SponsorEmail = '${SponsorEmail}', @Phone = '${Phone}';`;
                console.log(query);
                    request.query(query, function (err, recordset) {
                        if (err){
                            console.log(err)
                            res.send("Something wrong")
                        } 
                        else{
                            res.send("Success");
                        }
                        // send records as a response
                        
                        
                    });
            }
            else{
                res.send("Invalid data")
            }
         
        }

  
    });
});


// var server = app.listen(5000, function () {
//     console.log('Server is running..');
// });

const PORT = 4001
https.createServer(app).listen(PORT, console.log(`server runs on port ${PORT}`))
