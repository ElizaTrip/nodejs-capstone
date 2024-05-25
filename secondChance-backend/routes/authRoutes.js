const express = require('express');
const connectToDatabase = require('../models/db');
const logger = require('../logger');
const bcryptjs = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
        const collection = await db.collection('users');
        // Task 3: Check if user credentials already exists in the database and throw an error if they do

        const email = req.body.email;
        const user = collection.findOne({email: email}); 
        if (user) {
            logger.error('Email id already exists');
            return res.status(404).json({message: "User with this email already exists."})
        }
        // Task 4: Create a hash to encrypt the password so that it is not readable in the database
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Task 5: Insert the user into the database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 6: Create JWT authentication if passwords match with user._id as payload
        // Task 7: Log the successful registration using the logger
        // Task 8: Return the user email and the token as a JSON
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});