const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
const public_users = express.Router();

// Assume this is the URL where you get the book data
const BOOKS_URL = 'https://youssefabde7-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'; // Replace with the actual URL

// Endpoint to get all books using an async callback function
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(BOOKS_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book list" });
    }
});

// Route to get the list of books
public_users.get('/', async (req, res) => {
    try {
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book list" });
    }
});

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error("Book not found"));
        }
    })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ message: error.message }));
});


// Route to get book details based on author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book => book.author === author);
        if (results.length > 0) {
            resolve(results);
        } else {
            reject(new Error("No books found by this author"));
        }
    })
    .then(booksByAuthor => res.status(200).json(booksByAuthor))
    .catch(error => res.status(404).json({ message: error.message }));
});

// Route to get book details based on title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book => book.title === title);
        if (results.length > 0) {
            resolve(results);
        } else {
            reject(new Error("No books found with this title"));
        }
    })
    .then(booksByTitle => res.status(200).json(booksByTitle))
    .catch(error => res.status(404).json({ message: error.message }));
});

// Route to get book reviews based on ISBN
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        if (books[isbn]) {
            res.status(200).json({ [`reviews for isbn ${isbn}`]: books[isbn].reviews });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving reviews" });
    }
});

module.exports.general = public_users;
