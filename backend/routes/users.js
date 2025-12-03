const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get and perform functions via POST
router.post('/', async (req, res) => {
    try {
        // const newUser = await User.registerUsers();
        // res.status(201).json(newUser);
        let response = {};

        switch (req.body.command) {
            case "registerUsers":
                response = await User.registerUsers(req.body.params);
                break;
            case "memberLogin":
                response = await User.memberLogin(req.body.params);
                break;
        }

        res.status(201).json(response);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;