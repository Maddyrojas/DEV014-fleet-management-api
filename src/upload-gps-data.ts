import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Args {
  type: 'taxis' | 'trajectories';
  dbname: string;
  host: string;
  port: number;
  username: string;
  password: string;
  pathToFiles: string;
}

// Configuración de yargs para parsear los argumentos
const argv = yargs(hideBin(process.argv))
  .command('<path-to-files>', 'Path to the folder containing files', yargs => {
    yargs.positional('path-to-files', { describe: 'Path to the folder containing files', type: 'string' });
  })
  .options({
    type: { type: 'string', demandOption: true, describe: 'Type of data to load', choices: ['taxis', 'trajectories'] },
    dbname: { type: 'string', demandOption: true, describe: 'Database name' },
    host: { type: 'string', demandOption: true, describe: 'Database host' },
    port: { type: 'number', demandOption: true, describe: 'Database port' },
    username: { type: 'string', demandOption: true, describe: 'Database username' },
    password: { type: 'string', demandOption: true, describe: 'Database password' },
  })
  .help()
  .alias('help', 'h')
  .demandCommand(1, 'You need to provide the path to the folder')
  .parseSync();

// Asignación correcta del argumento posicional
const { type, dbname, host, port, username, password, _: [pathToFiles] } = argv as unknown as Args & { _: [string] };

// Función para cargar taxis
export const loadTaxis = async (filePath: string, client: Client): Promise<void> => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  for (const line of lines) {
    if (line.trim() === '') continue;
    const [id, plate] = line.split(',');
    await client.query('INSERT INTO taxis (id, plate) VALUES ($1, $2)', [id.trim(), plate.trim()]);
  }
};

// Función para cargar trajectories
export const loadTrajectories = async (filePath: string, client: Client): Promise<void> => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  for (const line of lines) {
    if (line.trim() === '') continue;
    const [taxi_id, date, latitude, longitude] = line.split(',');
    await client.query(
      'INSERT INTO trajectories (taxi_id, date, latitude, longitude) VALUES ($1, $2, $3, $4)',
      [taxi_id.trim(), date.trim(), parseFloat(latitude.trim()), parseFloat(longitude.trim())]
    );
  }
};

// Función para procesar todos los archivos en la carpeta
export const processFolder = async (folderPath: string, client: Client): Promise<void> => {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.resolve(folderPath, file);
    console.log(filePath);
    if (type === 'taxis') {
      await loadTaxis(filePath, client);
    } else if (type === 'trajectories') {
      await loadTrajectories(filePath, client);
    } else {
      console.error('Unsupported type');
    }
  }
};

// Función principal
const main = async (): Promise<void> => {
  const client = new Client({
    user: username,
    host: host,
    database: dbname,
    password: password,
    port: port,
  });
  try {
    await client.connect();
    await processFolder(pathToFiles, client);
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    await client.end();
  }
};

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
