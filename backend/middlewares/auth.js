import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export {authMiddleware};