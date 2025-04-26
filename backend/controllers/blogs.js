const router = require('express').Router();
const { Blog, User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Op } = require('sequelize');

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization');
    if(auth && auth.toLowerCase().startsWith('bearer ')){
        try {
            req.decodedToken = jwt.verify(auth.substring(7), SECRET);
            next();
        }catch {
            return res.status(401).send({ error: "Token invalid" });
        }
    } else {
        return res.status(401).send({ error: "Token missing or invalid" });
    }
}

router.post(`/`, tokenExtractor, async (req, res) => {
    try {
        const { author, title, yearWritten } = req.body;
        const userId = req.decodedToken.id;
    
        const blog = await Blog.create({
            userId: userId,
            author: author, 
            title: title, 
            url: "example.com",
            yearWritten: yearWritten
        })

        res.send(blog);
    } catch (e) {
        if (e.name === "SequelizeValidationError") {
            return res.status(400).send({ error: "Validation error: yearWritten must be an integer between 1991 and the current year" });
        } else {
            console.log("Error creating blog:", e);
            res.status(400).send({ error: "Could not create blog post" });
        }
    }
})

router.get(`/`, async (req, res) => {
    let where = {};

    if (req.query.search) {
        where = {
            [Op.or]: {
                author: {
                    [Op.substring]: req.query.search
                },
                title: {
                    [Op.substring]: req.query.search
                }
            }
        }
    }
    
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['username']
        },
        order: [
            ['likes', 'DESC']
        ],
        where
    });
    
    // console.log(JSON.stringify(blogs, null, 2));
    res.send(blogs);
})

const blogGetter = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
}

router.get(`/:id`, blogGetter, async (req, res) => {
    const { blog } = req;
    
    if (!blog) {
        return res.status(404).send({ error: "Blog not found" });
    }
    
    res.send(blog);
})

// Update likes
router.put(`/:id`, blogGetter, async (req, res) => {
    const { blog } = req;

    if (!blog) {
        return res.status(404).send({ error: "Blog not found" });
    }
    try {
        blog.likes = req.body.likes;
        blog.save();
        res.send({likes: blog.likes});
    } catch(e) {
        console.error("Error updating blog:", e);
        res.status(500).send({ error: "Failed to update blog" });
    }

})

router.delete(`/:id`, tokenExtractor, blogGetter, async (req, res) => {
    if(req.decodedToken.id !== req.blog.userId) {
        return res.status(401).send({ error: "Unauthorized" });
    }

    const { blog } = req;
    const id = blog.id;

    if(!blog) {
        return res.status(404).send({ error: "blog not found" });
    }

    blog.destroy();
    res.send({msg: `Deleted blog with id ${id}`});
})

module.exports = router;