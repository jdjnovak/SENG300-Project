// a basic API for the admin functions of our program

require('dotenv').config();
var express = require("express");
var mysql = require('mysql');
var router = express.Router();

// might have to change this when adding to this file... does this make router interpret everything as a JSON??...
router.use(express.json({ limit: '1mb' }));  // (basic) to ensure no insane loading of the db

var pool = mysql.createPool({  // using a pool so can handle multiple queries over time
  connectionLimit : process.env.LIMIT,  // important
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PW,
  debug: false
});




// used for UPDATE queries, specifically for USERS. 
// It's parameterized (safe), since it's using user-input form data,
// so if you need to use UPDATE, take this and modify it for your specific use-case

router.post('/update', (req, res) => {  
  let user = req.body;
  let updateQuery = "UPDATE USERS  SET email = ?, password = ?, fName = ?, lName = ?, isResearcher = ?, isReviewer = ?, isEditor = ?  WHERE email = ?";
  let params = [ user.email, user.password, user.fName, user.lName, 
                 user.isResearcher, user.isReviewer, user.isEditor, user.originalEmail  ];
  let preparedQuery = mysql.format(updateQuery, params);
  pool.query(preparedQuery, (err, response) => {
    console.log("Connected to database...\n");
    if(err) {
      console.error(err);
      return;
    }
    console.log("user updated in USERS table!");
    res.send("User updated");     
  });
})

router.get("/update", function(req, res, next){
  res.send("API for admin UPDATE queries is working properly");
});






function addUser(user) {
    let insertQuery = "INSERT INTO USERS VALUES (?,?,?,?,?,?,?)";
    let params = [ user.email, user.password, user.fName, user.lName, 
                   user.isResearcher, user.isReviewer, user.isEditor  ];
    let preparedQuery = mysql.format(insertQuery, params);
    pool.query(preparedQuery, (err, response) => {
      console.log("Connected to database...\n");
      if(err) {
        console.error(err);
        return;
      }
      console.log("New user added to USERS table!");
      console.log(response.insertId);      
    });
  }

// Implemented this a bit differently from the rest: has a delay and calls the above function... supposed to be a little better.
router.post('/insert', (req, res) => {
  const user = req.body; // the input tuple
  setTimeout(() => {  // timeout avoids firing query before connection happens
    addUser(user);
  }, 2000);

  res.send("New user added");  // response back to client. min: response.end();
});






router.get("/", function(req, res, next){
  res.send("admin INSERT API is working properly");
});

module.exports = router;