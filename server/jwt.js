const { sign, verify } = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const createToken = (user) => {
    const accessToken = sign({ userId: user.id_user, userName: user.name }, process.env.TOKEN_SECRET, {
    });
    return accessToken;
};

const validatedToken = (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(400).json({ error: 'Session expired' });
    };
    try {
        const validToken = verify(accessToken, process.env.TOKEN_SECRET);
        if(validToken) {
            req.authenticated = true;
            req.userId = validToken.userId;
            req.userName = validToken.userName;
            return next();
        }
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

module.exports = { createToken, validatedToken };