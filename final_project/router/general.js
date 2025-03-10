const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(isValid(username)){
      users.push({username, password});
      return res.status(200).send("Registered succesfully");
    }else{
      return res.status(400).send("Error. username not valid");
    }
  }else{
    return res.status(400).send("User or password not provided");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksArray = Object.values(books);
  let result = booksArray.filter(b => b.author === author);
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksArray = Object.values(books);
  let result = booksArray.filter(b => b.title === title);
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
