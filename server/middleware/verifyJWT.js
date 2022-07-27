const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    if(!authHeader) return res.status(401).json({message: 'unauthorized'})
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {  // decoded data from jwt
            if(err) return res.status(403).json({message: err.message});
            req.username = decoded.username;
            next();
        }
    )
}

module.exports = verifyJWT;