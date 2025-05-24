const { execSync } = require('child_process');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: debes pasar el nombre de la migración como argumento');
  process.exit(1);
}

const migrationsDir = './src/common/database/migrations/';

const command = `typeorm-ts-node-commonjs migration:create ${migrationsDir}${migrationName}`;

console.log(`Ejecutando: ${command}`);

execSync(command, { stdio: 'inherit' });
