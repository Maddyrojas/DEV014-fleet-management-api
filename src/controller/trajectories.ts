import { Handler } from "express";
import { getTaxiLocations, getLastTaxisLocation } from "../services/trajectoriesService";
import { sendEmail } from "../services/emailService";
import { getExcel} from "../services/excelService";

export const getTrajectoriesByIdDate: Handler = async (req, res) => {
    try {
        const id = +(req.query.taxiId as string);
        const dateStr = req.query.date as string;
        if (!id || !dateStr) {
            return res.status(400).json({ message: 'The taxiId and date parameters are required in the query' });
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: 'The date format is invalid' });
        }
        const taxiLocation = await getTaxiLocations(id, date);
        if (taxiLocation.length===0) {
            return res.status(404).json({ message: "No routes found for this taxiId, please correct the taxiId" });
        } else {
            return res.status(200).json(taxiLocation);
        }
    } catch (error) {
        return res.status(500).json({message: 'Server error', error});
    }
}

export const lastTrajectory: Handler = async (req, res) =>{
    try {
        const trajectory = await getLastTaxisLocation();
        return res.status(200).json(trajectory);
    } catch (error) {
        return res.status(500).json({error: 'Error when obtaining the last location of the taxis'});
    }
}

export const exportTrajectory: Handler = async (req, res) =>{
    try {
        const id = +(req.query.taxiId as string);
        const dateStr = req.query.date as string;
        const email = req.query.email as string;
        if (!id || !dateStr || !email) {
            return res.status(400).json({ message: 'The taxiId, email and date parameters are required in the query' });
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: 'The date format is invalid' });
        }
        const taxiLocation = await getTaxiLocations(id, date);
        if (taxiLocation.length===0) {
            return res.status(404).json({ message: "No routes found for this taxiId, please correct the taxiId" });
        }
        const filePath = await getExcel(taxiLocation, id, dateStr);
        await sendEmail(email, id, dateStr, filePath);
        return res.status(200).json({ message: 'The trajectories were sent correctly to your email' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Error al obtener la ultima ubicacion de los taxis'});
    }
}
