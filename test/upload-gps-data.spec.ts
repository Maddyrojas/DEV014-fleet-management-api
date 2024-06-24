// upload-gps-data.spec.ts
import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { loadTaxis, loadTrajectories, processFolder } from '../src/upload-gps-data';
import { parseArgs } from '../src/args'; // Import parseArgs from the modified file

jest.mock('fs');
jest.mock('path');
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

describe('loadTaxis', () => {
  it('should load taxis data from file', async () => {
    const filePath = 'test/taxis.txt';
    const client = new Client();
    const fileContent = '1,ABC123\n2,DEF456';
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    await loadTaxis(filePath, client);

    expect(client.query).toHaveBeenCalledTimes(2);
    expect(client.query).toHaveBeenCalledWith('INSERT INTO taxis (id, plate) VALUES ($1, $2)', ['1', 'ABC123']);
    expect(client.query).toHaveBeenCalledWith('INSERT INTO taxis (id, plate) VALUES ($1, $2)', ['2', 'DEF456']);
  });
});

describe('loadTrajectories', () => {
  it('should load trajectories data from file', async () => {
    const filePath = 'test/trajectories.txt';
    const client = new Client();
    const fileContent = '1,2023-01-01 12:00:00,123.45,67.89\n2,2023-01-01 13:00:00,123.46,67.88';
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    await loadTrajectories(filePath, client);

    expect(client.query).toHaveBeenCalledTimes(2);
    expect(client.query).toHaveBeenCalledWith(
      'INSERT INTO trajectories (taxi_id, date, latitude, longitude) VALUES ($1, $2, $3, $4)',
      ['1', '2023-01-01 12:00:00', 123.45, 67.89]
    );
    expect(client.query).toHaveBeenCalledWith(
      'INSERT INTO trajectories (taxi_id, date, latitude, longitude) VALUES ($1, $2, $3, $4)',
      ['2', '2023-01-01 13:00:00', 123.46, 67.88]
    );
  });
});

describe('processFolder', () => {
  it('should process all files in the folder for taxis', async () => {
    const folderPath = 'test/taxis';
    const client = new Client();
    const files = ['taxis1.txt', 'taxis2.txt'];
    (fs.readdirSync as jest.Mock).mockReturnValue(files);
    (path.resolve as jest.Mock).mockImplementation((folder, file) => `${folder}/${file}`);
    
    const fileContent = '1,ABC123\n2,DEF456';
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    await processFolder(folderPath, 'taxis', client);

    expect(client.query).toHaveBeenCalledTimes(4); // 2 files * 2 queries each
  });

  it('should process all files in the folder for trajectories', async () => {
    const folderPath = 'test/trajectories';
    const client = new Client();
    const files = ['trajectories1.txt', 'trajectories2.txt'];
    (fs.readdirSync as jest.Mock).mockReturnValue(files);
    (path.resolve as jest.Mock).mockImplementation((folder, file) => `${folder}/${file}`);
    
    const fileContent = '1,2023-01-01 12:00:00,123.45,67.89\n2,2023-01-01 13:00:00,123.46,67.88';
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

    await processFolder(folderPath, 'trajectories', client);

    expect(client.query).toHaveBeenCalledTimes(4); // 2 files * 2 queries each
  });
});
