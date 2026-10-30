const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('   🚀 Launching NearbyHire (Backend + Frontend)    ');
console.log('====================================================\n');

// 1. Launch Backend Server (port 5000)
const backend = spawn(process.execPath, ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

// 2. Launch Frontend Dev Server (port 5173)
const viteBin = path.join(__dirname, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn(process.execPath, [viteBin], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit'
});

// Graceful cleanup on stop
const cleanExit = () => {
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
