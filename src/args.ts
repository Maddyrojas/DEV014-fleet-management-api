// args.ts
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface Args {
  type: 'taxis' | 'trajectories';
  dbname: string;
  host: string;
  port: number;
  username: string;
  password: string;
  pathToFiles: string;
}

export const parseArgs = (): Args => {
  const argv = yargs(hideBin(process.argv.slice(2)))
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

  const { type, dbname, host, port, username, password, _: [pathToFiles] } = argv as unknown as Args & { _: [string] };
  return { type, dbname, host, port, username, password, pathToFiles };
};
