const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> !users.some(u => u.username == username);

const authenticatedUser = (username,password)=> users.some(u => u.username==username && u.password==password);


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){return res.status(400).send("User and password required")}
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({username}, 'access',{expiresIn: '1h'});
    return res.status(200).json({message:"Logged in succesfully", accessToken});

  }else{
    return res.status(401).send("Login error");
  }

});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  const content = req.body.content;
  const rating = req.body.rating;
  if(!username){
    return res.status(401).send("username not found")
  }
  if(content && rating){
    books[isbn].reviews[username] = {content, rating};
    return res.status(200).send("Review published");
  }
  else{
    return res.status(401).send("Not content nor rating found, username: "+ username);
  }


});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.user.username;
  const isbn = req.params.isbn;
  if(username && isbn && books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).send("Review deleted");
  }
  else{
    return res.status(401).send("Error deleting review");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
