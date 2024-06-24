const ExcelJS = require('exceljs');
import path from 'path';
import fs from 'fs';

export const getExcel = async (data: any[], id: number, dateStr: string) => {
    const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
    const filePath = path.join(__dirname, 'temp', `taxi_trajectory_${id}_${dateStr}.xlsx`);
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Data');
    const newData = data.map(item => ({
        id: item.id,
        plate: item.taxis.plate,
        latitude: item.latitude,
        longitude: item.longitude,
        date: item.date
    }));
    worksheet.columns = Object.keys(newData[0]).map(key => ({header: key.toUpperCase(),key: key}));
    worksheet.addRows(newData);
    await workbook.xlsx.writeFile(filePath);
    console.log(`Excel file created at ${filePath}`);
    return filePath
}