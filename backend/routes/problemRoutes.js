import express from 'express';
import { runProblemController, getProblemController, updateProblemController } from '../controllers/problemController.js';
import { authMiddleware } from '../middlewares/auth.js';


const router = express.Router();


router.post('/run', (req, res) => {
    runProblemController(req, res);
});

router.get('/:id', authMiddleware, (req, res) => {
    getProblemController(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
    updateProblemController(req, res);
});


export default router;