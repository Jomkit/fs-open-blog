const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

// Get all authors, including total blogs and total likes
router.get('/', async (req, res) => {
    try {
        const authors = await Blog.findAll({
            attributes: 
                [
                    'author', 
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalBlogs'],
                    [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes']
                ],
                group: 'author',
        })

        return res.json(authors);
    } catch(e) {
        console.error(e);
        res.status(500).json({"error:": e});
    }
})

module.exports = router;