import { exec } from 'child_process';

function getNetworkTraffic() {
  return new Promise((resolve, reject) => {
    const command =
      process.platform === 'win32'
        ? 'netstat -e' // Windows command to fetch network statistics
        : 'cat /proc/net/dev'; // Linux command to fetch network statistics

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`Command error output: ${stderr}`);
        return;
      }

      if (process.platform === 'win32') {
        // Parse Windows output
        const lines = stdout.split('\n');
        const statsLine = lines.find((line) => line.includes('Bytes')); // Find the line with traffic data
        if (statsLine) {
          const stats = statsLine.trim().split(/\s+/);
          const received = parseInt(stats[1], 10); // Bytes received
          const sent = parseInt(stats[2], 10); // Bytes sent
          resolve({
            received: (received / (1024 ** 2)).toFixed(2) + ' MB', // Convert to MB
            sent: (sent / (1024 ** 2)).toFixed(2) + ' MB', // Convert to MB
          });
        } else {
          reject('Failed to parse network traffic data.');
        }
      } else {
        // Parse Linux output
        const lines = stdout.trim().split('\n').slice(2); // Skip headers
        let totalReceived = 0;
        let totalTransmitted = 0;

        lines.forEach((line) => {
          const parts = line.split(/[:\s]+/).filter(Boolean);
          totalReceived += parseInt(parts[1], 10); // Bytes received
          totalTransmitted += parseInt(parts[9], 10); // Bytes transmitted
        });

        resolve({
          received: (totalReceived / (1024 ** 2)).toFixed(2) + ' MB', // Convert to MB
          sent: (totalTransmitted / (1024 ** 2)).toFixed(2) + ' MB', // Convert to MB
        });
      }
    });
  });
}

export default getNetworkTraffic;