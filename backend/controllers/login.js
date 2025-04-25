const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { SECRET } = require('../util/config');
const User = require('../models/user');

router.post('/', async (req, res) => {
    const body = req.body;

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    // Simple password check for development
    const pwCorrect = body.password === "secret";
    if(!(user && pwCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        });
    }
    const useForToken = {
        username: user.username,
        id: user.id
    }
    const token = jwt.sign(useForToken, SECRET);

    res.status(200).send({token, username: user.username, name: user.name});
})

module.exports = router;