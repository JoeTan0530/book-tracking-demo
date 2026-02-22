const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET all books
// router.get('/', async (req, res) => {
//     try {
//         const books = await Book.find({}, "id email").sort({ createdAt: -1 });
//         res.json(books);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// POST new book
router.post('/', async (req, res) => {
    try {
        let response = {};

        let command = req.body.command;

        let params = req.body.params;

        switch (command) {
            case "getBookList":
                response = await Book.getBookList(params);
                break;
            case "addBookItem":
                response = await Book.addBookItem(params);
                break;
            case "editBookItem":
                response = await Book.editBookItem(params);
                break;
            case "getStatusList":
                response = await Book.getStatusList();
                break;
            case "removeBookItem":
                response = await Book.removeBookItem(params);
                break;
        }

        res.status(201).json(response);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;