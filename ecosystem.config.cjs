// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'trading-bot',
      script: './dist/index.js',
      node_args: '--env-file=.env',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
