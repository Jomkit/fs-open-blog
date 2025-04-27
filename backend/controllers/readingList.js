const router = require('express').Router();
const { ReadingList, Blog } = require('../models');
const { sequelize } = require('../util/db');

// Create new reading list entry
router.post('/', async (req, res) => {
    const { userId, blogId } = req.body;

    try {
        const readingListEntry = await ReadingList.create({ user_id: userId, blog_id: blogId });
        res.status(201).json(readingListEntry);
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: 'Failed to create reading list entry' });
    }
})

module.exports = router;