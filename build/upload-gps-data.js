"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFolder = exports.loadTrajectories = exports.loadTaxis = void 0;
var fs = require("fs");
var path = require("path");
var pg_1 = require("pg");
var args_1 = require("./args");
var loadTaxis = function (filePath, client) { return __awaiter(void 0, void 0, void 0, function () {
    var fileContent, lines, _i, lines_1, line, _a, id, plate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileContent = fs.readFileSync(filePath, 'utf8');
                lines = fileContent.split('\n');
                _i = 0, lines_1 = lines;
                _b.label = 1;
            case 1:
                if (!(_i < lines_1.length)) return [3 /*break*/, 4];
                line = lines_1[_i];
                if (line.trim() === '')
                    return [3 /*break*/, 3];
                _a = line.split(','), id = _a[0], plate = _a[1];
                return [4 /*yield*/, client.query('INSERT INTO taxis (id, plate) VALUES ($1, $2)', [id.trim(), plate.trim()])];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loadTaxis = loadTaxis;
var loadTrajectories = function (filePath, client) { return __awaiter(void 0, void 0, void 0, function () {
    var fileContent, lines, _i, lines_2, line, _a, taxi_id, date, latitude, longitude;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileContent = fs.readFileSync(filePath, 'utf8');
                lines = fileContent.split('\n');
                _i = 0, lines_2 = lines;
                _b.label = 1;
            case 1:
                if (!(_i < lines_2.length)) return [3 /*break*/, 4];
                line = lines_2[_i];
                if (line.trim() === '')
                    return [3 /*break*/, 3];
                _a = line.split(','), taxi_id = _a[0], date = _a[1], latitude = _a[2], longitude = _a[3];
                return [4 /*yield*/, client.query('INSERT INTO trajectories (taxi_id, date, latitude, longitude) VALUES ($1, $2, $3, $4)', [taxi_id.trim(), date.trim(), parseFloat(latitude.trim()), parseFloat(longitude.trim())])];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loadTrajectories = loadTrajectories;
var processFolder = function (folderPath, type, client) { return __awaiter(void 0, void 0, void 0, function () {
    var files, _i, files_1, file, filePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = fs.readdirSync(folderPath);
                _i = 0, files_1 = files;
                _a.label = 1;
            case 1:
                if (!(_i < files_1.length)) return [3 /*break*/, 7];
                file = files_1[_i];
                filePath = path.resolve(folderPath, file);
                console.log(filePath);
                if (!(type === 'taxis')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.loadTaxis)(filePath, client)];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                if (!(type === 'trajectories')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, exports.loadTrajectories)(filePath, client)];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                console.error('Unsupported type');
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.processFolder = processFolder;
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, dbname, host, port, username, password, pathToFiles, client, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, args_1.parseArgs)(), type = _a.type, dbname = _a.dbname, host = _a.host, port = _a.port, username = _a.username, password = _a.password, pathToFiles = _a.pathToFiles;
                client = new pg_1.Client({
                    user: username,
                    host: host,
                    database: dbname,
                    password: password,
                    port: port,
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, client.connect()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, exports.processFolder)(pathToFiles, type, client)];
            case 3:
                _b.sent();
                return [3 /*break*/, 7];
            case 4:
                err_1 = _b.sent();
                console.error('Error loading data:', err_1);
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, client.end()];
            case 6:
                _b.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
if (require.main === module) {
    main().catch(function (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    });
}
