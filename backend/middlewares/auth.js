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
        console.log(req.ip);
        if(req.ip === "::1" || req.ip === "::ffff:172.17.0.1"){
            req.auth = payload;
            next();
        } else if (payload.ip === req.ip) {
            req.auth = payload;
            next();
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
      
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export {authMiddleware};