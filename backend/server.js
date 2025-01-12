import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contestRoutes from './routes/contestRoutes.js';
import problemRoutes from './routes/problemRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/problems', problemRoutes);

app.get('/', (req, res) => {
    // System info
    const info = {
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        upTime: process.uptime(),
    };
    const memoryInMB = info.memoryUsage.rss / 1024 / 1024;
    const message = {
        nodeVersion: `Node.js version: ${info.nodeVersion}`,
        memoryUsage: `Process memory usage: ${memoryInMB.toFixed(2)} MB`,
        upTime: `Process uptime: ${info.upTime}`,
    }
    res.send(message);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
