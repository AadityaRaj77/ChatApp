const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token missing 💦' });
    }
    else {
        const token = authHeader.split(' ')[1];
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.room = decode;
            next();
        }
        catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token 👻' });
        }
    }

}
module.exports = verifyToken;