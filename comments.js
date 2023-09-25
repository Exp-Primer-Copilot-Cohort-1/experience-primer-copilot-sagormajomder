// Create web server

// Import modules

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Comment } = require('../models/Comment');
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const { auth } = require('../middleware/auth');

// @route   POST api/comments
// @desc    Create a comment
// @access  Private

router.post(

    '/',
    [
        auth,
        [
            check('text', 'Text is required').not().isEmpty(),
            check('post', 'Post is required').not().isEmpty()
        ]
    ],

    async (req, res) => {

        // Check for errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };

        // Destructure request body

        const { text, post } = req.body;

        try {

            // Create comment

            const comment = new Comment({
                text,
                post,
                user: req.user.id
            });

            // Save comment

            await comment.save();

            // Add comment to post

            const postObject = await Post.findById(post);

            postObject.comments.unshift(comment);

            await postObject.save();

            // Add comment to user

            const userObject = await User.findById(req.user.id);

            userObject.comments.unshift(comment);

            await userObject.save();

            // Return comment

            return res.status(200).json(comment);

        } catch (err) {

            // Log error to console

            console.error(err.message);

            // Return error message

            return res.status(500).send('Server error');

        };

    }

);










