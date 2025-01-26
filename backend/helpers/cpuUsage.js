import os from 'os';

function getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;

    // Loop through CPU cores
    for (let i = 0, len = cpus.length; i < len; i++) {
        const cpu = cpus[i];
        for (const type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }

    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function calculateCpuPercentage(interval = 1000) {
    return new Promise((resolve) => {
        const startMeasure = getCpuUsage();

        setTimeout(() => {
            const endMeasure = getCpuUsage();

            const idleDifference = endMeasure.idle - startMeasure.idle;
            const totalDifference = endMeasure.total - startMeasure.total;

            const cpuPercentage = (1 - idleDifference / totalDifference) * 100;
            resolve(cpuPercentage);
        }, interval);
    });
}

export default calculateCpuPercentage;