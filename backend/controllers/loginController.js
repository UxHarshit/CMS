import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { configDotenv } from 'dotenv';
configDotenv();

const loginController = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: 'Invalid request.' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: 'Invalid user or password.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid user or password.' });
        }
        const payload = {
            email: user.email,
            username : user.username
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '20h',
        });
        res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export default loginController;