import express from 'express';
import { runProblemController } from '../controllers/problemController.js';

const router = express.Router();


router.post('/run', (req, res) => {
    runProblemController(req, res);
});


export default router;