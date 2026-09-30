module.exports = {
  apps: [
    {
      name: 'khaosat-tungthien',
      script: 'server/app.js',
      cwd: '/var/www/khaosatquyhoach',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3026
      }
    }
  ]
};
