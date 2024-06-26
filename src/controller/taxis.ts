import { Handler } from "express";
import { getTaxis } from "../services/taxiService";

export const getAllTaxis: Handler = async (req, res) => {
  try {
    const page = +(req.query.page as string) || 1;
    const limit = +(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const plateIn = req.query.plate as string;
    if (page<0 || limit<0) {
      return res.status(400).json({ message: "The page number and limit cannot be less than 0" });
    }
    const taxis = await getTaxis(startIndex, limit, plateIn);
    console.log(taxis);
    if (taxis.length===0) {
      return res.status(404).json({ message: "No taxis found, please change the license plate number" });
    } else {
      return res.status(200).json(taxis);
    }
    //return res.status(401).json({ message: "if there is no authentication header" });
    //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'error al obtener los taxis' })
  }
}