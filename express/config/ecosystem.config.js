module.exports = {
  apps: [
    {
      name: 'gusd-dashboard',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: ['server.js'],
      ignore_watch: ['node_modules'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
