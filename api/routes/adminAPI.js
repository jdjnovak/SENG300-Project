// a basic API for the admin functions of our program

require('dotenv').config();
var express = require("express");
var mysql = require('mysql');
var router = express.Router();

router.use(express.json({ limit: '1mb' }));  // (basic) to ensure no insane loading of the db

var pool = mysql.createPool({  // using a pool so can handle multiple queries over time
  connectionLimit : process.env.LIMIT,  // important
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PW,
  debug:  false
});



function addUser(user) {
    let insertQuery = "INSERT INTO ?? VALUES (?,?,?,?,?,?,?)";
    let params = [ "USERS",   user.email, user.password, user.fName, user.lName, 
                              user.isResearcher, user.isReviewer, user.isEditor  ];
    let query = mysql.format(insertQuery, params);
    pool.query(query, (err, response) => {
      console.log("Connected to database...\n");
      if(err) {
        console.error(err);
        return;
      }
      console.log("New user added to USERS table!");
      console.log(response.insertId);
      //return( res.json(result) );       
    });
  }

router.post('/', (req, res) => {
  const user = req.body; // the input tuple
  setTimeout(() => {  // timeout avoids firing query before connection happens
    addUser(user);
  }, 2000);

  res.send("New user added to USERS table");  // response back to client. min: response.end();
});





router.get("/", function(req, res, next){
  res.send("admin API is working properly");
});

module.exports = router;