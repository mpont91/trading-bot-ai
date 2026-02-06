// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'trading-bot',
      script: './dist/index.js',
      node_args: '--env-file=.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
