const router = require('express').Router();
const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: ['author', 'title']
        }
    });
    res.send(users);
})

router.post('/', async (req, res) => {
    const { name, username } = req.body;
    const user = await User.create({ name, username });
    res.send(user);
})

// change username TODO
router.put('/:username', async (req, res) => {
    const currUsername = req.params.username;

    try {
        const user = await User.findOne({ where: { username: currUsername } });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        newUsername = req.body.username;
        user.username = newUsername;
        await user.save();
        res.send({msg: "Username updated: " + newUsername});
    } catch(e) {
        console.error(e);
        res.status(500).end();
    }
})

module.exports = router;