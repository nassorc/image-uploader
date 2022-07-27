const router = require('express').Router();  //server for everything we need
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyJWT = require('../middleware/verifyJWT');
require('dotenv').config();

let db = [
    {
        userId: 1,
        username: 'nassorc',
        password: '123'
    },
    {
        userId: 2,
        username: 'MrRaindrop',
        password: '321'
    }
]

// refresh token controller
const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    // checks if we have cookies and then a jwt property
    if(!cookie?.jwt) return res.status(401)

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
}

// add logic to controller
router.post('/login', (req, res) => {
    const {username, password }= req.body
    if (!username || !password) {
        return res.status(400).json({message: 'username and password are required'})
    }
    const foundUser = db.filter(user => (user.username === username))[0];
    
    if (!foundUser || foundUser.length < 1) return res.status(401).json({message: 'username or password is invalid'})

    const match = true;

    if (match) {
        // create jwt
        // dont pass password, because if someone access the token it will reveal the password
        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );
        // saved in the database / logout will invalidate the refresh token
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        
        // Saving refreshToken with current user
        const otherUsers = db.filter(user => user.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken}
        db = [...otherUsers, currentUser]

        // send tokens to user
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({ accessToken })

    } else {
        return res.status(401).json({message: 'username or password is invalid'})
    }

});

router.get('/user', verifyJWT, (req, res) => {
    const username = req.username;
    const data = db.filter(user => user.username === username)[0];
    console.log(data)
    return res.status(200).json(data);
})

router.post('/register', (req, res) => {
    res.status(200).json({message: 'user registered'})
})


module.exports = router