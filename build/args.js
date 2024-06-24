"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = void 0;
var yargs_1 = require("yargs");
var helpers_1 = require("yargs/helpers");
var parseArgs = function () {
    var argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .command('<path-to-files>', 'Path to the folder containing files', function (yargs) {
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
    var _a = argv, type = _a.type, dbname = _a.dbname, host = _a.host, port = _a.port, username = _a.username, password = _a.password, pathToFiles = _a._[0];
    return { type: type, dbname: dbname, host: host, port: port, username: username, password: password, pathToFiles: pathToFiles };
};
exports.parseArgs = parseArgs;
