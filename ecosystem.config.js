module.exports = {
  apps: [{
    name: 'gassess_web',
    script: 'dist/server/index.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      PORT: 8333,
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'web',
      host: '149.129.56.110',
      ref: 'origin/master',
      repo: 'git@github.com:lenconda/gassess_web.git',
      path: '/home/web/space/gassess_web',
      'post-deploy': 'npm i && npm run clean && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
