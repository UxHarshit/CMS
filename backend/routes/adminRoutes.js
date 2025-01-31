import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import basicUserInfo from '../middlewares/basicUserInfo.js';
import os from 'os';
import calculateCpuPercentage from '../helpers/cpuUsage.js';
import { sendMail } from '../controllers/emailController.js';
import { Logs } from '../models/index.js';

import { userListController, problemListController, addProblemController, deleteProblemController ,
    getAllContest,
    getContestData,
    getAllInstitution
} from '../controllers/adminController.js';
const router = express.Router();


const isAdmin = async (req, res, next) => {
    if (!req.user.profile.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource"
        });
    }
    next();
}

const isSuperAdmin = async (req, res, next) => {
    if (!req.user.profile.isSuperAdmin) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource"
        });
    }
    next();
}
router.post('/UserList', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    await userListController(req, res);
});

router.post('/problemList', authMiddleware, basicUserInfo, isSuperAdmin, async (req, res) => {
    await problemListController(req, res);
});


router.post('/addProblem', authMiddleware, basicUserInfo, isSuperAdmin, async (req, res) => {
    await addProblemController(req, res);
});

router.post('/deleteProblem', authMiddleware, basicUserInfo, isSuperAdmin, async (req, res) => {
    await deleteProblemController(req, res);
})

router.post('/email', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    await sendMail(req, res);
});


router.post('/logs', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    // Get Recent Logs
    const { rangeStart, rangeEnd } = req.body;
    try {
        let logs;
        if (rangeStart && rangeEnd) {
            logs = await Logs.findAll({
                where: {
                    createdAt: {
                        $between: [new Date(rangeStart), new Date(rangeEnd)]
                    }
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
        } else {
            logs = await Logs.findAll({
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ]
            });
        }
        res.status(200).json({
            success: true,
            logs: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get('/sysInfo', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    const curr_ram_free = os.freemem();
    const curr_usage = os.totalmem() - curr_ram_free;

    const cpu = os.cpus();
    // toal cpu usage in percentage
    let total_cpu_usage = 0;
    for (let i = 0; i < cpu.length; i++) {
        total_cpu_usage += cpu[i].times.user + cpu[i].times.sys;
    }

    const cpu_usage = await calculateCpuPercentage();

    const message = {
        curr_ram_free: (curr_ram_free > 1024) ? `${(curr_ram_free / (1024 * 1024 * 1024)).toFixed(2)} GB` : `${curr_ram_free.toFixed(2) / (1024 * 1024)} MB`,
        curr_ram_usage: (curr_usage > 1024) ? `${(curr_usage / (1024 * 1024 * 1024)).toFixed(2)} GB` : `${curr_usage.toFixed(2) / (1024 * 1024)} MB`,
        total_ram: (os.totalmem() > 1024) ? `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB` : `${os.totalmem().toFixed(2) / (1024 * 1024)} MB`,
        cpu_usage: `${cpu_usage.toFixed(2)} %`,
    }
    res.status(200).json(message);
});


router.post('/allContests', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    await getAllContest(req, res);
});

router.post('/getContestData', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    await getContestData(req, res);
});

router.get('/getInstitutions', authMiddleware, basicUserInfo, isAdmin, async (req, res) => {
    await getAllInstitution(req, res);
});

export default router;