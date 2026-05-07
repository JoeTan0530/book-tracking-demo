const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get and perform functions via POST
router.post('/', async (req, res) => {
    try {
        let response = {};

        let command = req.body.command;

        let params = req.body.params;

        switch (command) {
            case "registerUsers":
                response = await User.registerUsers(params);
                break;
            case "memberLogin":
                response = await User.memberLogin(params);
                break;
        }

        res.status(201).json(response);

    } catch (error) {
        let errorResponse = generateReturnObj("Error", 2, "", error.message);
        res.status(400).json(errorResponse);
    }
});

module.exports = router;