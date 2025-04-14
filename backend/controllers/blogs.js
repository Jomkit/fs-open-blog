const router = require('express').Router();
const { Blog } = require('../models');

router.post(`/`, async (req, res) => {
    try {
        const { author, title } = req.body;
    
        const blog = await Blog.create({
            author: author, 
            title: title, 
            url: "example.com"
        })
    
        res.send(blog);
    } catch (e) {
        console.error("Error creating blog:", e);
        res.status(400).send({ error: "Failed to create blog" });
    }
})

router.get(`/`, async (req, res) => {
    const blogs = await Blog.findAll();
    
    console.log(JSON.stringify(blogs, null, 2));
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

router.delete(`/:id`, blogGetter, async (req, res) => {
    const { blog } = req;

    if(!blog) {
        return res.status(404).send({ error: "blog not found" });
    }

    blog.destroy();
    res.send({msg: `Deleted blog with id ${id}`});
})

module.exports = router;