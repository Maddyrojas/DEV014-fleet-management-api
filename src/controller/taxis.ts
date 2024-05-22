import { Handler } from "express";
import { getTaxis } from "../services/taxiService";

export const getAllTaxis: Handler = async (req, res) => {
  try {
    const page = +(req.query.page as string) || 1;
    const limit = +(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const plateIn = req.query.plate as string;
    const taxis = await getTaxis(startIndex, limit, plateIn);
    return res.status(200).json(taxis);
    //return 400 que pagina y limit no sean negativas. https://www.restapitutorial.com/httpstatuscodes.html
    //return res.status(401).json({ message: "if there is no authentication header" });
    //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
    //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'error al obtener los taxis' })
  }
}