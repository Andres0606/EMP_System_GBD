module.exports = {
  apps: [{
    name: 'gestionbd-backend',
    script: '/usr/bin/java',
    args: '-DTNS_ADMIN=/opt/oracle/wallet -Djavax.net.ssl.trustStore=/opt/oracle/wallet/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit -jar target/backend-0.0.1-SNAPSHOT.jar',
    cwd: '/var/www/GestionBD/BACK/backend/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      WALLET_DIR: '/opt/oracle/wallet',
      DB_USER: 'ADMIN',
      DB_PASS: 'Ananrollona2021*',
      CORS_ORIGINS: 'https://gestionbd.trabajosucc.site'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log'
  }]
};
